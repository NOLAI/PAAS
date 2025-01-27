use std::collections::HashMap;
use libpep::distributed::key_blinding::BlindedGlobalSecretKey;
use libpep::distributed::systems::PEPClient;
use libpep::high_level::contexts::{EncryptionContext, PseudonymizationDomain};
use libpep::high_level::data_types::{Encryptable, Encrypted, EncryptedPseudonym};
use libpep::high_level::keys::GlobalPublicKey;
use rand_core::{CryptoRng, RngCore};
use serde::{Deserialize, Serialize};
use crate::transcryptor_client::{TranscryptorClient, TranscryptorConfig};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PseudonymServiceConfig {
    pub blinded_global_secret_key: BlindedGlobalSecretKey,
    pub global_public_key: GlobalPublicKey,
    pub transcryptors: Vec<TranscryptorConfig>
}
pub type EncryptionContexts = HashMap<String, EncryptionContext>;

pub struct PseudonymService {
    config: PseudonymServiceConfig,
    transcryptors: Vec<TranscryptorClient>,
    pub pep_crypto_client: Option<PEPClient>,
    current_session: EncryptionContexts
}

/// Convert encrypted pseudonyms into your own pseudonyms, using the [PseudonymService].
/// The service will communicate with the configured transcryptors, and wraps around a [PEPClient] for cryptographic operations.
impl PseudonymService {
    pub fn new(config: PseudonymServiceConfig) -> Self {
        let transcryptors = config.transcryptors.iter().map(|c| {
            TranscryptorClient::new(c.clone())
        }).collect();
        Self {
            config,
            transcryptors,
            pep_crypto_client: None,
            current_session: HashMap::new()
        }
    }

    /// Start a new session with all configured transcryptors, and initialize a [PEPClient] using the session keys.
    pub async fn init(&mut self) {
        self.current_session = HashMap::new();
        let mut sks = vec![];
        for transcryptor in &mut self.transcryptors {
            let (session_id, key_share) = transcryptor.start_session().await.unwrap();
            sks.push(key_share);
            self.current_session.insert(transcryptor.config.system_id.clone(), EncryptionContext::from(&session_id));
        }
        self.pep_crypto_client = Some(PEPClient::new(self.config.blinded_global_secret_key, &sks));
    }

    /// Transform an encrypted pseudonym into your own pseudonym.
    pub async fn pseudonymize(&mut self, encrypted_pseudonym: &EncryptedPseudonym, session_from: &EncryptionContexts, domain_from: &PseudonymizationDomain, domain_to: &PseudonymizationDomain) -> EncryptedPseudonym {
        if self.pep_crypto_client.is_none() {
            self.init().await;
        }
        let mut transcrypted = *encrypted_pseudonym;
        for transcryptor in &self.transcryptors {
            let ec_to = self.current_session.get(&transcryptor.config.system_id).unwrap();
            let ec_from = session_from.get(&transcryptor.config.system_id).unwrap();
            transcrypted = transcryptor.pseudonymize(&transcrypted, domain_from, domain_to, ec_from, ec_to).await.expect("Communication with transcryptor failed");
        }
        transcrypted
    }

    /// Transform a batch of encrypted pseudonyms into your own pseudonyms.
    /// Notice that the order of the pseudonyms in the input and output vectors are NOT the same, to prevent linking.
    /// If you need to preserve the order, you should call the [pseudonymize] method for each pseudonym individually. (TODO: add a feature flag to preserve order)
    pub async fn pseudonymize_batch(&mut self, encrypted_pseudonyms: &Vec<EncryptedPseudonym>, session_from: &EncryptionContexts, domain_from: &PseudonymizationDomain, domain_to: &PseudonymizationDomain) -> Vec<EncryptedPseudonym> {
        if self.pep_crypto_client.is_none() {
            self.init().await;
        }
        let mut transcrypted = encrypted_pseudonyms.clone();
        for transcryptor in &self.transcryptors {
            let ec_to = self.current_session.get(&transcryptor.config.system_id).unwrap();
            let ec_from = session_from.get(&transcryptor.config.system_id).unwrap();
            transcrypted = transcryptor.pseudonymize_batch(transcrypted, domain_from, domain_to, ec_from, ec_to).await.expect("Communication with transcryptor failed");
        }
        transcrypted
    }

    /// Encrypt a message using the [PEPClient]'s current session.
    pub fn encrypt<R: RngCore + CryptoRng, E: Encryptable>(
        self,
        message: &E,
        rng: &mut R,
    ) -> (E::EncryptedType, EncryptionContexts) {
        (self.pep_crypto_client.unwrap().encrypt(message, rng), self.current_session.clone())
    }

    /// Decrypt an encrypted message using the [PEPClient]'s current session.
    pub fn decrypt<E: Encrypted>(self, encrypted: &E) -> E::UnencryptedType {
        self.pep_crypto_client.unwrap().decrypt(encrypted)
    }
}