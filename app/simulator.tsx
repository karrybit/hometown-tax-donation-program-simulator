import { Flex, NumberInput, Text } from "@mantine/core";
import React, { useCallback, useState } from "react";
import { calculateIncomeBasicExemption, calculateResidentialTax, calculateIncomeTax, calculateIncomeTaxRate, calculateSocialInsurancePremiums } from './core';

type AnnualIncomeInputProps = {
    setAnnualIncome: React.Dispatch<React.SetStateAction<number>>
};
const AnnualIncomeInput: React.FunctionComponent<AnnualIncomeInputProps> = ({ setAnnualIncome }) => {
    const onChange = useCallback((value: number | string) => {
        setAnnualIncome(Number(value));
    }, [setAnnualIncome]);
    return (
        <NumberInput
            size='lg'
            label='額面'
            placeholder='0'
            suffix='円'
            clampBehavior='strict'
            min={0}
            max={100000000}
            thousandSeparator=','
            allowNegative={false}
            allowDecimal={false}
            onChange={onChange}
        />
    );
}

type IncomeBasicExemptionProps = {
    value: number;
};
const IncomeBasicExemption: React.FunctionComponent<IncomeBasicExemptionProps> = ({ value }) => {
    return (
        <Flex
            gap='mid'
            justify='center'
            align='center'
            direction='row'
        >
            <Text>所得基礎控除</Text>
            <Text>{value}</Text>
        </Flex>
    );
}

type SocialInsurancePremiumsProps = {
    value: number;
};
const SocialInsurancePremiums: React.FunctionComponent<SocialInsurancePremiumsProps> = ({ value }) => {
    return (
        <Flex
            gap='mid'
            justify='center'
            align='center'
            direction='row'
        >
            <Text>社会保険料</Text>
            <Text>{value}</Text>
        </Flex>
    );
}

type OtherDeductionProps = {
    setOtherDeduction: React.Dispatch<React.SetStateAction<number>>,
};
const OtherDeduction: React.FunctionComponent<OtherDeductionProps> = ({ setOtherDeduction }) => {
    const onChange = useCallback((value: number | string) => {
        setOtherDeduction(Number(value));
    }, [setOtherDeduction]);
    return (
        <NumberInput
            size='lg'
            label='その他控除'
            placeholder='0'
            suffix='円'
            clampBehavior='strict'
            min={0}
            max={100000000}
            thousandSeparator=','
            allowNegative={false}
            allowDecimal={false}
            onChange={onChange}
        />
    );
}

type ResidentialTaxProps = {
    value: number;
};
const ResidentialTax: React.FunctionComponent<ResidentialTaxProps> = ({ value }) => {
    return (
        <Flex
            gap='mid'
            justify='center'
            align='center'
            direction='row'
        >
            <Text>住民税</Text>
            <Text>{value}</Text>
        </Flex>
    );
}

type IncomeTaxProps = {
    value: number;
};
const IncomeTax: React.FunctionComponent<IncomeTaxProps> = ({ value }) => {
    return (
        <Flex
            gap='mid'
            justify='center'
            align='center'
            direction='row'
        >
            <Text>所得税</Text>
            <Text>{value}</Text>
        </Flex>
    );
}

type TakeHomePayProps = {
    value: number;
};
const TakeHomePay: React.FunctionComponent<TakeHomePayProps> = ({ value }) => {
    return (
        <Flex
            gap='mid'
            justify='center'
            align='center'
            direction='column'
        >
            <Flex
                gap='mid'
                justify='center'
                align='center'
                direction='row'
            >
                <Text>手取り</Text>
                <Text>{value}</Text>
            </Flex>
            <Flex
                gap='mid'
                justify='center'
                align='center'
                direction='row'
            >
                <Text>手取り月額</Text>
                <Text>{Math.floor(value / 12)}</Text>
            </Flex>
        </Flex>
    );
}

type UpperLimitHometownTaxDonationProps = {
    value: number;
};
const UpperLimitHometownTaxDonation: React.FunctionComponent<UpperLimitHometownTaxDonationProps> = ({ value }) => {
    return (
        <Flex
            gap='mid'
            justify='center'
            align='center'
            direction='row'
        >
            <Text>ふるさと納税上限額</Text>
            <Text>{value}</Text>
        </Flex>
    );
}

type ReturnGiftProps = {
    value: number;
};
const ReturnGift: React.FunctionComponent<ReturnGiftProps> = ({ value }) => {
    return (
        <Flex
            gap='mid'
            justify='center'
            align='center'
            direction='row'
        >
            <Text>返礼品上限額</Text>
            <Text>{value}</Text>
        </Flex>
    );
}

type HometownTaxDonationMerginProps = {
    value: number;
};
const HometownTaxDonationMergin: React.FunctionComponent<HometownTaxDonationMerginProps> = ({ value }) => {
    return (
        <Flex
            gap='mid'
            justify='center'
            align='center'
            direction='row'
        >
            <Text>ふるさと納税控除差益</Text>
            <Text>{value}</Text>
        </Flex>
    );
}

type EconomicsOfHometownTaxDonationProps = {
    value: number;
};
const EconomicsOfHometownTaxDonation: React.FunctionComponent<EconomicsOfHometownTaxDonationProps> = ({ value }) => {
    return (
        <Flex
            gap='mid'
            justify='center'
            align='center'
            direction='row'
        >
            <Text>ふるさと納税経済性（控除差益 - (ふるさと納税上限額 - 返礼品上限額)）</Text>
            <Text>{value}</Text>
        </Flex>
    );
}

export const Simulator: React.FunctionComponent = () => {
    const [annualIncome, setAnnualIncome] = useState(0);
    const incomeBasicExeption = calculateIncomeBasicExemption(annualIncome);
    const income = annualIncome - incomeBasicExeption;

    const socialInsurancePremiums = calculateSocialInsurancePremiums(income);
    const [otherDeduction, setOtherDeduction] = useState(0);

    const taxable = income - socialInsurancePremiums - otherDeduction;
    const residentialTax = calculateResidentialTax(taxable);
    const incomeTax = calculateIncomeTax(taxable);

    const takeHomePay = annualIncome - socialInsurancePremiums - residentialTax - incomeTax;

    const incomeTaxRate = calculateIncomeTaxRate(taxable);
    // 所得税の20% / (100% - 住民税率 - 所得税 * 復興特別所得税率) + 2000
    const upperLimitHometownTaxDonation = Math.floor(residentialTax * 0.2 / (1 - 0.1 - incomeTaxRate * 1.021) + 2000);
    // 返礼品上限額
    const upperLimitReturnGift = Math.floor(upperLimitHometownTaxDonation / 3);

    const taxableMinusHometownTaxDonation = income - socialInsurancePremiums - otherDeduction - upperLimitHometownTaxDonation;
    const residentialTaxMinusHometownTaxDonation = calculateResidentialTax(taxableMinusHometownTaxDonation);
    const incomeTaxMinusHometownTaxDonation = calculateIncomeTax(taxableMinusHometownTaxDonation);
    const takeHomePayMinusHometownTaxDonation = annualIncome - socialInsurancePremiums - residentialTaxMinusHometownTaxDonation - incomeTaxMinusHometownTaxDonation;
    // 控除差益
    const hometownTaxDonationMergin = takeHomePayMinusHometownTaxDonation - takeHomePay;
    // ふるさと納税経済性
    const economicsOfHometownTaxDonation = hometownTaxDonationMergin - (upperLimitHometownTaxDonation - upperLimitReturnGift);

    return (
        <Flex
            gap='md'
            justify='center'
            align='center'
            direction='column'
            wrap='wrap'
        >
            <AnnualIncomeInput setAnnualIncome={setAnnualIncome}></AnnualIncomeInput>
            <IncomeBasicExemption value={incomeBasicExeption}></IncomeBasicExemption>
            <SocialInsurancePremiums value={socialInsurancePremiums}></SocialInsurancePremiums>
            <OtherDeduction setOtherDeduction={setOtherDeduction}></OtherDeduction>
            <ResidentialTax value={residentialTax}></ResidentialTax>
            <IncomeTax value={incomeTax}></IncomeTax>
            <TakeHomePay value={takeHomePay}></TakeHomePay>
            <UpperLimitHometownTaxDonation value={upperLimitHometownTaxDonation}></UpperLimitHometownTaxDonation>
            <ReturnGift value={upperLimitReturnGift}></ReturnGift>
            <HometownTaxDonationMergin value={hometownTaxDonationMergin}></HometownTaxDonationMergin>
            <EconomicsOfHometownTaxDonation value={economicsOfHometownTaxDonation}></EconomicsOfHometownTaxDonation>
        </Flex>
    );
}
