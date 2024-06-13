// округление числа до сотых
const roundToDecimal = (value: number) => {
  console.log('Вызов roundValues')
  if (value !== undefined) {
    console.log('Вызов roundValues для ${value}')
    // if (typeof value === 'number') {
    //   value = parseFloat(value.toFixed(2));
    // } else if (typeof value === 'string') {
    //   let parsedPrice = parseFloat(value);
    //   if (!isNaN(parsedPrice)) {
    //     value = parseFloat(parsedPrice.toFixed(2));
    //   }
    // }
    value = parseFloat(value.toFixed(2));
  }
  console.log(value)
}

export default roundToDecimal;