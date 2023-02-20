import randomColor from 'randomcolor'
/**
 * 
 * @param {predicate object from Flask} preds 
 * @returns predicate array
 */
const formatPredicateArray = (preds) => {
    return Object.entries(preds).map((m) => {
        return {"id": m[0], "predicate": m[1], color: randomColor()}
    })
}

export default formatPredicateArray;