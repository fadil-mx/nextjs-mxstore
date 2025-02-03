import { cwd } from 'process'
import { connectDB } from '.'
import data from '../data'
import product from './models/productmodel'
import { loadEnvConfig } from '@next/env'

loadEnvConfig(cwd())

const main = async () => {
  try {
    const products = data.products
    await connectDB(process.env.MONGO_URL)

    await product.deleteMany()

    const createdProducts = await product.insertMany(products)

    console.log(createdProducts, 'seeded database successfully')
    process.exit(0)
  } catch (error) {
    console.error('error seeding database:', error)
    throw new Error('error seeding database')
  }
}
main()
