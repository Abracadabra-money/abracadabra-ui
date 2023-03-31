import expandDecimals from './expand-decimals';

module.exports = (amount, divDecimals, mulDecimals) => amount.mul(expandDecimals(1, mulDecimals)).div(expandDecimals(1, divDecimals));