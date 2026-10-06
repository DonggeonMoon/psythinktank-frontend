import * as React from "react";
import type {HeadFC} from "gatsby";
import PolicyDocument from "../components/PolicyDocument";
import {policyLabels} from "../i18n/pageLabels";
import {INVESTMENT_DISCLAIMER_TEXT} from "../../policy-statement/investmentDisclaimerText";

const DisclaimerPage = () => <PolicyDocument title={policyLabels.investmentDisclaimer} body={INVESTMENT_DISCLAIMER_TEXT}/>;

export default DisclaimerPage;

export const Head: HeadFC = () => <title>{policyLabels.investmentDisclaimer.ko}</title>;
