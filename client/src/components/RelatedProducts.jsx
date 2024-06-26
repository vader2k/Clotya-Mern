import Card from "./Card"
import { useContext } from "react"
import {ShopContext} from '../context/ShopContext'

const RelatedProducts = ({props}) => {

  const {allProducts} = useContext(ShopContext) // handles all products fetching

  const category = props.category[1].name
  const Related = allProducts.filter(product => product.category.some(cat => cat.name === category))

  return (
    <section className="w-full">
      <h1 className="text-[1.3rem] pb-4 border-b font-medium">Related products</h1>
      <div className="items-start gap-6 lg:flex hidden">
        {Related.slice(6,10).map((items) => (
          <Card key={items.id} props={items} />
        ))}
      </div>
      <div className="items-start gap-6 lg:hidden flex">
        {Related.slice(6,8).map((items) => (
          <Card key={items.id} props={items} />
        ))}
      </div>
      <div className="items-start gap-6 lg:hidden flex">
        {Related.slice(8,10).map((items) => (
          <Card key={items.id} props={items} />
        ))}
      </div>
    </section>
  )
}

export default RelatedProducts