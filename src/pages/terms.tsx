import * as React from "react";
import type {HeadFC} from "gatsby";
import PolicyDocument from "../components/PolicyDocument";
import {policyLabels} from "../i18n/pageLabels";
import {TERMS_OF_SERVICE_TEXT} from "../../policy-statement/termsOfServiceText";

const TermsPage = () => <PolicyDocument title={policyLabels.termsOfService} body={TERMS_OF_SERVICE_TEXT}/>;

export default TermsPage;

export const Head: HeadFC = () => <title>{policyLabels.termsOfService.ko}</title>;
