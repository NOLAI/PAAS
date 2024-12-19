use chrono::Utc;
use libpep::high_level::contexts::PseudonymizationContext;
use paas_server::access_rules::{AccessRules, AuthenticatedUser, Permission};
use std::collections::HashSet;
use std::sync::Arc;

#[test]
fn test_access_rules_integration() {
    let user = AuthenticatedUser {
        username: Arc::new("test_user".to_string()),
        usergroups: Arc::new(HashSet::from(["group1".to_string()])),
    };

    let permission = Permission {
        usergroups: vec!["group1".to_string()],
        start: Some(Utc::now() - chrono::Duration::hours(1)),
        end: Some(Utc::now() + chrono::Duration::hours(1)),
        from: vec![PseudonymizationContext::from("context1")],
        to: vec![PseudonymizationContext::from("context2")],
    };

    let access_rules = AccessRules {
        allow: vec![permission],
    };

    assert!(access_rules.has_access(
        &user,
        &PseudonymizationContext::from("context1"),
        &PseudonymizationContext::from("context2")
    ));
}

#[test]
fn test_access_rules_edge_cases() {
    let user_with_valid_group = AuthenticatedUser {
        username: Arc::new("valid_user".to_string()),
        usergroups: Arc::new(HashSet::from(["group1".to_string()])),
    };

    let user_with_invalid_group = AuthenticatedUser {
        username: Arc::new("invalid_user".to_string()),
        usergroups: Arc::new(HashSet::from(["group2".to_string()])),
    };

    let permission = Permission {
        usergroups: vec!["group1".to_string()],
        start: Some(Utc::now() - chrono::Duration::hours(1)),
        end: Some(Utc::now() + chrono::Duration::hours(1)),
        from: vec![PseudonymizationContext::from("context1")],
        to: vec![PseudonymizationContext::from("context2")],
    };

    let access_rules = AccessRules {
        allow: vec![permission],
    };

    // Test valid user with valid time and contexts
    assert!(access_rules.has_access(
        &user_with_valid_group,
        &PseudonymizationContext::from("context1"),
        &PseudonymizationContext::from("context2")
    ));

    // Test valid user with valid group but outside valid time range
    let permission_outside_time = Permission {
        usergroups: vec!["group1".to_string()],
        start: Some(Utc::now() + chrono::Duration::hours(1)),
        end: Some(Utc::now() + chrono::Duration::hours(2)),
        from: vec![PseudonymizationContext::from("context1")],
        to: vec![PseudonymizationContext::from("context2")],
    };

    let access_rules_outside_time = AccessRules {
        allow: vec![permission_outside_time],
    };

    assert!(!access_rules_outside_time.has_access(
        &user_with_valid_group,
        &PseudonymizationContext::from("context1"),
        &PseudonymizationContext::from("context2")
    ));

    // Test user with invalid group
    assert!(!access_rules.has_access(
        &user_with_invalid_group,
        &PseudonymizationContext::from("context1"),
        &PseudonymizationContext::from("context2")
    ));

    // Test valid user with valid group and time but incorrect contexts
    assert!(!access_rules.has_access(
        &user_with_valid_group,
        &PseudonymizationContext::from("context3"),
        &PseudonymizationContext::from("context4")
    ));
}
