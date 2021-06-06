const taxCalculation = taxes => {
    let sum = 0;
    taxes.forEach(tax => sum = sum + tax.rate);
    return sum;
}

export const taxRateToAmmount = product => {
    console.log(product);
    const rate = taxCalculation(product.unitTaxes);
    const {unitPrice} = product;
    return {
        rate,
        ammount: Number((unitPrice * (1 + rate*0.01)) - unitPrice).toFixed(2)
    }
}

export const statusDomObject = (status, quantity) => {
    let dom = ["secondary", ".", ""];
    if (status === 0) dom = ["success", "Disponible", <i class="fas fa-check"></i>];
    if (status === 1) dom = ["success", quantity+" en stock", <i class="fas fa-check"></i>];
    if (status === 2) dom = ["danger", "Pas en stock", <i className="fas fa-exclamation-triangle"></i>];
    if (status === 3) dom = ["warning", "Archivé", <i class="fas fa-archive"></i>];
    if (status === 5) dom = ["warning", "Product suspendu", <i className="fas fa-exclamation-triangle"></i>];
    return <h5><span class={"badge bg-"+dom[0]}>{dom[2]} {dom[1]}</span></h5>;
}