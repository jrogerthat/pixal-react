import { useContext } from "react"
import { DataContext } from "../context"

export const BookmarkComponent = () => {
    const [{bookmarkPlots},] = useContext(DataContext);

    return(
        <div>{bookmarkPlots.map((bp, i) => (
            <div key={`${i}-bm`}>bookmark</div>
        ))}</div>
    )
}