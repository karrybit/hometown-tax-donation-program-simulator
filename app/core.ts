type AnnualIncome = number; // 年収
type IncomeBasicExemption = number; // 所得基礎控除
type SocialInsurancePremiums = number; // 社会保険料
type Taxable = number;
const ResidentialTaxBasicExemption = 430000; // 住民税基礎控除
type ResidentialTax = number; // 住民税
const IncomeTaxBasicExemption = 480000; // 所得税基礎控除
type IncomeTaxable = number; // 所得税課税対象
type IncomeTax = number; // 所得税
type IncomeTaxRate = number; // 所得税率

// 所得控除の計算
export function calculateIncomeBasicExemption(ai: AnnualIncome): IncomeBasicExemption {
    if (ai <= 1625000) { return 550000; }
    if (ai <= 1800000) { return ai*0.4 - 100000; }
    if (ai <= 3600000) { return ai*0.3 + 80000; }
    if (ai <= 6600000) { return ai*0.2 + 440000; }
    if (ai <= 8500000) { return ai*0.1 + 1100000; }
    return 1950000;
}
// 社会保険料
export function calculateSocialInsurancePremiums(ai: AnnualIncome): SocialInsurancePremiums {
    // 健康保険料
    const healthInsurancePremium = Math.floor(Math.floor(ai * 0.0998) / 2); // 事業主と折半
    // 厚生年金
    const welfarePension = Math.floor(Math.floor(ai * 0.183) / 2); // 事業主と折半
    return healthInsurancePremium + welfarePension;
}

// 住民税の計算
export function calculateResidentialTax(t: Taxable): ResidentialTax {
    const residentialTaxable = t - ResidentialTaxBasicExemption;
    return Math.max(Math.floor(residentialTaxable * 0.1), 0);
}

// 所得税率の計算
export function calculateIncomeTaxRate(t: Taxable): IncomeTaxRate {
    const taxable = t - IncomeTaxBasicExemption;
    if (taxable <= 1000) { return 0.00; }
    if (1000 < taxable && taxable <= 1950000) { return 0.05; }
    if (1950000 < taxable && taxable <= 3300000) { return 0.10; }
    if (3300000 < taxable && taxable <= 6950000) { return 0.20; }
    if (6950000 < taxable && taxable <= 9000000) { return 0.23; }
    if (9000000 < taxable && taxable <= 18000000) { return 0.33; }
    if (18000000 < taxable && taxable <= 40000000) { return 0.40; }
    return 0.45;
}
// 所得税の累進課税の計算
function _calculateIncomeTax(it: IncomeTaxable): IncomeTax {
    let sum = 0;
    sum += Math.max(Math.min(it - 1000, 1950000 - 1000) * 0.05, 0);
    sum += Math.max(Math.min(it - 1950000, 3300000 - 1950000) * 0.10, 0);
    sum += Math.max(Math.min(it - 3300000, 6950000 - 3300000) * 0.20, 0);
    sum += Math.max(Math.min(it - 6950000, 9000000 - 6950000) * 0.23, 0);
    sum += Math.max(Math.min(it - 9000000, 18000000 - 9000000) * 0.33, 0);
    sum += Math.max(Math.min(it - 18000000, 40000000 - 18000000) * 0.40, 0);
    sum += Math.max(it - 40000000 * 0.45, 0);
    return Math.floor(sum);
}
// 所得税の計算
export function calculateIncomeTax(t: Taxable): IncomeTax {
    const incomeTaxable = t - IncomeTaxBasicExemption;
    const incomeTax = _calculateIncomeTax(incomeTaxable);
    return incomeTax;
}
