import randomColor from 'randomcolor'
/**
 * 
 * @param {predicate object from Flask} preds 
 * @returns predicate array
 */
const formatPredicateArray = (preds) => {
    return Object.entries(preds).map((m) => {
        let predOb = m[1].attribute_values ? m[1] : {'attribute_values': m[1], 'negated': false};
        return {id: m[0], parent: m[1].parent ? m[1].parent : null, predicate: predOb, color: colorArray.length < +m[0] ? randomColor() : colorArray[+m[0]] }
    });
}

const colorArray = [
    '#FFBF00',
    '#FF7F50',
    '#FF33A5',
    '#DE3163',
    '#229954',
    '#9FE2BF',
    '#40E0D0', //TEAL
    '#6495ED',
    '#CCCCFF', //light periwinkle
    '#900C3F',
    '#21618C',
]

export default formatPredicateArray;