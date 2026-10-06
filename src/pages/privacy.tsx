import * as React from "react";
import type {HeadFC} from "gatsby";
import PolicyDocument from "../components/PolicyDocument";
import {policyLabels} from "../i18n/pageLabels";
import {PRIVACY_POLICY_TEXT} from "../../policy-statement/privacyPolicyText";

const PrivacyPage = () => <PolicyDocument title={policyLabels.privacyPolicy} body={PRIVACY_POLICY_TEXT}/>;

export default PrivacyPage;

export const Head: HeadFC = () => <title>{policyLabels.privacyPolicy.ko}</title>;
