interface Params {
  id: string;
}

const ProductDetailsPage = async ({ params }: { params: Promise<Params> }) => {
  const { id } = await params;
  return <h1>Product ID: {id}</h1>;
};

export default ProductDetailsPage;
