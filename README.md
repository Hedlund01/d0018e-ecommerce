# D0018E LTU - Ecommerce store

This project is an e-commerce website, focusing primarily on database part of the back-end.  Key functionalities include inventory display, purchase and order management, user and administrator view separation, and user interaction through reviews.

The project uses [Next.js](https://nextjs.org/) with Typescript and [@vercel/postgres](https://vercel.com/docs/storage/vercel-postgres/sdk) for database connection. The front-end uses [joy UI](https://mui.com/joy-ui/getting-started/) and [MUI X Data Grid](https://mui.com/x/react-data-grid/). The project is meant to be hosted on [Vercel](https://vercel.com), with a CI/CD pipeline that automatically updates the project with each new commit to the main branch in this GitHub repository.

The database schema consists of User, Order, Product, Cart and Review tables, with the User tables storing authentication information and the Product and Order tables storing information about products and orders respectively.


## How to use

Download [or clone the repo](https://github.com/Hedlund01/d0018e-ecommerce)


Install it and run:

```bash
yarn
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your web browser to see the result.


## Learn more

To learn more about this project go to [docs/report.md](https://github.com/Hedlund01/d0018e-ecommerce/blob/main/docs/report.md)
