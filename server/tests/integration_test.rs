use actix_web::body::to_bytes;
use actix_web::dev::Service;
use actix_web::web::Data;
use actix_web::{test, web, App, HttpMessage};
use libpep::distributed::key_blinding::{BlindingFactor, SafeScalar};
use libpep::distributed::systems::PEPSystem;
use libpep::high_level::contexts::PseudonymizationContext;
use libpep::high_level::data_types::{Encrypted, EncryptedPseudonym};
use libpep::high_level::keys::{EncryptionSecret, PseudonymizationSecret};
use paas_server::access_rules::{AccessRules, AuthenticatedUser, Permission};
use paas_server::application::sessions::{start_session, StartSessionResponse};
use paas_server::application::transcrypt::{pseudonymize, PseudonymizationResponse};
use paas_server::session_storage::{InMemorySessionStorage, SessionStorage};
use serde_json::json;
use std::collections::HashSet;
use std::sync::Arc;

#[actix_web::test]
async fn test_start_session_and_pseudonymize() {
    // std::env::set_var("RUST_LOG", "debug");
    // env_logger::builder()
    //     .is_test(true)
    //     .try_init()
    //     .ok();

    let auth_user = AuthenticatedUser {
        username: Arc::new("test".to_string()),
        usergroups: Arc::new(HashSet::from(["group1".to_string()])),
    };
    let permission = Permission {
        usergroups: vec!["group1".to_string()],
        start: Some(chrono::Utc::now() - chrono::Duration::hours(1)),
        end: Some(chrono::Utc::now() + chrono::Duration::hours(1)),
        from: vec![PseudonymizationContext::from("context1")],
        to: vec![PseudonymizationContext::from("context2")],
    };
    let access_rules = AccessRules {
        allow: vec![permission],
    };
    let session_storage: Box<dyn SessionStorage> = Box::new(InMemorySessionStorage::new());
    let pep_system = PEPSystem::new(
        PseudonymizationSecret::from("pseudonymization_secret".as_bytes().to_vec()),
        EncryptionSecret::from("encryption_secret".as_bytes().to_vec()),
        BlindingFactor::decode_from_hex(
            "5f5289d6909083257b9372c362a1905a0f0370181c5b75af812815513edcda0a",
        )
        .unwrap(),
    );

    let app = test::init_service(
        App::new()
            .wrap(actix_web::middleware::Logger::default())
            .app_data(Data::new(access_rules))
            .app_data(Data::new(session_storage))
            .app_data(Data::new(pep_system))
            .service(
                web::scope("")
                    .service(web::scope("sessions").route("/start", web::post().to(start_session)))
                    .route("/pseudonymize", web::post().to(pseudonymize)),
            ),
    )
    .await;

    // Start a session
    let req = test::TestRequest::post()
        .uri("/sessions/start")
        .to_request();
    req.extensions_mut().insert(auth_user.clone());
    let resp = app.call(req).await.unwrap();
    let body = to_bytes(resp.into_body()).await.unwrap();
    let start_session_response: StartSessionResponse = serde_json::from_slice(&body).unwrap();

    // Test pseudonymization
    let req = test::TestRequest::post()
        .uri("/pseudonymize")
        .set_json(json!({
        "encrypted_pseudonym": EncryptedPseudonym::from_base64("nr3FRadpFFGCFksYgrloo5J2V9j7JJWcUeiNBna66y78lwMia2-l8He4FfJPoAjuHCpH-8B0EThBr8DS3glHJw==").unwrap(),
        "pseudonym_context_from": PseudonymizationContext::from("context1"),
        "pseudonym_context_to": PseudonymizationContext::from("context2"),
        "enc_context": start_session_response.session_id,
        "dec_context": start_session_response.session_id,
    }))
        .to_request();
    req.extensions_mut().insert(auth_user.clone());
    let resp = app.call(req).await.unwrap();
    let body = to_bytes(resp.into_body()).await.unwrap();
    let pseudonymization_response: PseudonymizationResponse =
        serde_json::from_slice(&body).unwrap();
    assert_eq!(pseudonymization_response.encrypted_pseudonym, Encrypted::from_base64("BKuFy_qdWBsB9KO0yz5IJb4IbNIBq0oPOqsW6e2zlDTqCieW-9qweIQx-fal8rsr3Z21MPKzF-ZJLoZ3237XZQ==").unwrap());
}
