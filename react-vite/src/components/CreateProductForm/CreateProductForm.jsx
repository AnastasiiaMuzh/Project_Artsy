import "./CreateProductForm.css";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { createProduct, updateProduct, getDetails } from "../../redux/products";

function CreateProductForm() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { productId } = useParams();
    const user = useSelector((state) => state.session.session);
    const existingProduct = useSelector((state) => state.products.productDetails);
    const allProducts = useSelector((state) => state.products.allProducts);

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [previewImage, setPreviewImage] = useState('');
    const [otherImages, setOtherImages] = useState(['', '', '', '']);

    const isUpdate = !!productId;

    useEffect(() => {
        console.log("user: ", user)
        console.log("user.id: ", user.id)
        // console.log("user first name: ", user.firstName)
        // if (!user) {
        //     return navigate("/", {
        //         state: { error: "Please login to create a product" },
        //         replace: true
        //     });
        // }

        if (isUpdate && productId) {
            console.log("Fetching details for productId: ", productId);
            dispatch(getDetails(productId)).finally(()=> {
                setLoading(false)
            });
        } else {
            setLoading(false);
        }
    }, [dispatch, productId, isUpdate, user, navigate]);

    useEffect(() => {
        if (isUpdate && existingProduct) {
        console.log("Existing Product: ", existingProduct);
        setName(existingProduct.name || '');
        setDescription(existingProduct.description || '');
        setPrice(existingProduct.price || '');
        setCategory(existingProduct.category || '');
        const preview = existingProduct.ProductImages[0]?.url || '';
        const others = existingProduct.ProductImages.slice(1).map((img) => img.url) || ['', '', '', ''];
        setPreviewImage(preview);
        setOtherImages(others);
        }
    }, [existingProduct, isUpdate]);

    const handleOtherImages = (index, value) => {
        const updatedImages = [...otherImages];
        updatedImages[index] = value;
        setOtherImages(updatedImages);
    };

    const validateFields = () => {
        const errors = {};
        const urlRegex = /(png|jpg|jpeg)/i; 

        // Check if product name already exists
        const isNameTaken = Object.values(allProducts).some(
            (product) => product.name.toLowerCase() === name.toLowerCase() && product.id !== productId
        );

        if (!name) errors.name = "Name is required";
        else if (isNameTaken) errors.name = "Product name already exists";

        if (!description || description.length < 30) errors.description = "Description needs a minimum of 30 characters";
        if (!price || price <= 0) errors.price = "Price is required and cannot be used by an existing product";
        if (!category) errors.category = "Category is required";
        if (!previewImage) {
        errors.previewImage = "Preview image is required";
        } else if (!urlRegex.test(previewImage)) {
        errors.previewImage = "Preview image URL must contain .png, .jpg, or .jpeg";
        }

        otherImages.forEach((url) => {
        if (url.trim() && !urlRegex.test(url)) {  
            errors.otherImages = "Image URL must contain .png, .jpg, or .jpeg";
        }
        });

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateFields();
        if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
        }

        const productData = {
        name,
        description,
        price: parseFloat(price),
        category,
        };

        const imageUrls = [previewImage, ...otherImages.filter((url) => url.trim() !== "")];

        try {
            if (isUpdate) {
                const updatedProduct = await dispatch(updateProduct(productId, productData, imageUrls));
                console.log("updatedProduct: ", updatedProduct)
                navigate(`/api/products/${productId}`);
            } else {
                const createdProduct = await dispatch(createProduct(productData, imageUrls));
                console.log("createdProduct: ", createdProduct)
                navigate(`/api/products/${createdProduct.id}`); // Redirect to the new product page
            }
        } catch (error) {
            console.error("Error creating product: ", error)
        }
        
    };

    const renderError = (field) => {
        return errors[field] ?  <div className="error">{errors[field]}</div> : null;
    };

    if (loading) {
        return <p>Loading form...</p>;
    }

  return (
    <div>
      {/* <h1>Create Product</h1> */}
        <div className="create-product-container">
      <div className="header">
        <h1>{isUpdate ? "Update your Product" : "Create a new Product"}</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="product-details">
          <h3>Product Details</h3>
          <div className="name-category">
            <div>
              <label>Name:</label>
              <input 
                type="text" 
                // placeholder="Product Name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
              />
              {renderError("name")}
            </div>
            <div>
              <label>Category:</label>
              <input 
                type="text" 
                // placeholder="Category" 
                value={category} 
                onChange={(e) => setCategory(e.target.value)} 
              />
              {renderError("category")}
            </div>
          </div>

          <div className="description-price">
            <div>
              <label>Description:</label>
              <textarea 
                value={description} 
                // placeholder="Product description" 
                onChange={(e) => setDescription(e.target.value)} 
              />
              {renderError("description")}
            </div>

            <div>
              <label>Price:</label>
              <input 
                type="number" 
                // placeholder="Price in USD" 
                value={price} 
                onChange={(e) => setPrice(parseFloat(e.target.value))} 
              />
              {renderError("price")}
            </div>
          </div>
        </div>

        <div className="add-photos">
          <h3>Upload Product Images</h3>
          <div>
            <label>Preview Image:</label>
            <input 
              type="text" 
            //   placeholder="Preview Image URL" 
              value={previewImage} 
              onChange={(e) => setPreviewImage(e.target.value)} 
            />
            {renderError("previewImage")}
          </div>
          {otherImages.map((url, index) => (
            <div key={index}>
              <label>Additional Images {index + 1}:</label>
              <input 
                type="text" 
                // placeholder="Additional Image URL" 
                value={url} 
                onChange={(e) => handleOtherImages(index, e.target.value)} 
              />
            </div>
          ))}
        </div>

        <div className="create-button-div">
          <button type="submit">
            {isUpdate ? "Update Product" : "Create Product"}
          </button>
        </div>
      </form>
    </div>
    
    </div>
  )
}

export default CreateProductForm
