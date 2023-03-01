import randomColor from 'randomcolor'
/**
 * 
 * @param {predicate object from Flask} preds 
 * @returns predicate array
 */
const formatPredicateArray = (preds) => {
    return Object.entries(preds).map((m) => {
        
        let predOb = m[1].attribute_values ? m[1] : {'attribute_values': m[1], 'negated': false};
        return {id: m[0], predicate: predOb, color: randomColor()}
    })
}

export default formatPredicateArray;