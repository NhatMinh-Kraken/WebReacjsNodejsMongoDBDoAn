import Axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import Collapse from 'react-bootstrap/Collapse';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import imageUser from '../../../../../assets/images/add.png'
import Loading2 from '../../../../utils/Loadding/Loadding2'
import './CreateProduct.scss'


//markdown
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
// import style manually
import 'react-markdown-editor-lite/lib/index.css';
import { Button, Modal } from 'react-bootstrap';
//


const initialState = {
    name: '',
    type: '',
    money: '',
    energy: '',
    description: '',
    descriptionHTML: '',
    specifications: '',
    specificationsHTML: '',
    amount: '',
    id: '',
    // err: '',
    // success: ''
}

function EditProduct() {
    const auth = useSelector(state => state.auth)
    const { isAdmin } = auth

    const token = useSelector(state => state.token)

    const param = useParams()

    const [product, setProduct] = useState(initialState)
    const [callback, setCallback] = useState(false)

    const [markdown, setMarkdown] = useState("")
    const [specifications, setSpecifications] = useState("")


    //const { description, descriptionHTML } = markdown

    const history = useHistory()

    const { name, type, money, energy, description, descriptionHTML, amount } = product

    const [open, setOpen] = useState(false);

    const [avatar, setAvatar] = useState(false);
    const [colortypeone, setColortypeone] = useState(false);
    const [colortypetwo, setColortypetwo] = useState(false);
    const [colortypethree, setColortypethree] = useState(false);

    const [show, setShow] = useState(false)

    const [images, setImages] = useState([])

    const [loading, setLoading] = useState(false)

    // product
    const [products, setProducts] = useState([])
    const [category, setCategory] = useState('')
    const [sort, setSort] = useState('')
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [result, setResult] = useState(0)



    useEffect(() => {
        if (param.id) {
            //setOnEdit(true)
            products.forEach(productt => {
                if (productt._id == param.id) {
                    setProduct(productt)
                    setImages(productt.avatar)
                    // setAvatar(productt.avatar)
                    // setColortypeone(productt.colortypeone)
                    // setColortypetwo(productt.colortypetwo)
                    // setColortypethree(productt.colortypethree)
                    setMarkdown(productt)
                    setSpecifications(productt)
                    // console.log(product)
                }
            })
        }
        else {
            // setOnEdit(false)
            setProduct('')
            // setAvatar(false)
            // setColortypeone(false)
            // setColortypetwo(false)
            // setColortypethree(false)
            setMarkdown(false)
            setSpecifications(false)
        }
    }, [param.id, products])

    // useEffect(() => {
    //     const getProducts = async () => {
    //         const res = await Axios.get(`/api/products?limit=${page * 9}&${category}&${sort}&title[regex]=${search}`)
    //         setProducts(res.data.products)
    //         setResult(res.data.result)
    //     }
    //     getProducts()
    // }, [callback, category, sort, search, page])

    useEffect(() => {
        const getProducts = async () => {
            const res = await Axios.get('/api/products')
            setProducts(res.data)
        }
        getProducts()
    }, [callback])


    //category
    const [categories, setCategories] = useState([])

    useEffect(() => {
        const getCategories = async () => {
            const res = await Axios.get('/api/categorys')
            setCategories(res.data)
        }
        getCategories()
    }, [callback])
    //

    //upload image
    const changeUpload = async (e) => {
        try {
            const files = Array.from(e.target.files)
            let num = 0

            if (!isAdmin) {
                toast.error("You're not an admin")
                window.location.reload()
            }

            if (files.length === 0) {
                return toast.error("Files does not exist.")
            }

            files.forEach(file => {
                if (file.size > 1024 * 1024) {
                    return toast.error("Size too large.")
                }

                if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
                    return toast.error("File format is incorrect.")
                }

                const render = new FileReader()
                num += 1
                if (num <= 13) {
                    render.readAsDataURL(file)
                    render.onloadend = () => {
                        setImages(oldArray => [...oldArray, render.result])
                    }
                }
                else {
                    toast.error("Select up to 13.")
                }
            })

        } catch (err) {
            toast.error(err.response.data.msg)
        }
    }


    //

    console.log(images)


    //destroy
    const deleteImage = async (id, index) => {
        try {

            if (!isAdmin) {
                toast.error("You're not an admin")
                window.location.reload()
            }

            if (window.confirm("B???n c?? ch???c l?? mu???n x??a t???m ???nh n??y hay kh??ng? n?? c?? th??? ???nh h?????ng ?????n tr???i nghi???m ???nh c???a b???n v?? kh??ch h??ng ? h??y c??n nh???c k??? !!!!")) {

                setLoading(true)
                const newArr = [...images]
                newArr.splice(index, 1)
                setImages(newArr)

                const res = await Axios.post('/api/destroy_product_car', { public_id: id }, {
                    headers: { Authorization: token }
                })
                //console.log(id)
                // setCallback(!callback)
                // toast.success(res.data.msg)
                setLoading(false)
                setShow(true)
            }

        } catch (err) {
            toast.error(err.response.data.msg)
            setLoading(false)
        }
    }

    const handleSubmitImage = async (e) => {
        e.preventDefault();
        try {
            if (!isAdmin) {
                toast.error("You're not an admin")
            }
            if (!images) {
                toast.error("No avatar Upload")
            }

            await Axios.put(`/api/products/${product._id}`, {
                name: product.name,
                type: product.type,
                money: product.money,
                amount: product.amount,
                energy: product.energy,
                description: markdown.description,
                descriptionHTML: markdown.descriptionHTML,
                specifications: specifications.specifications,
                specificationsHTML: specifications.specificationsHTML,
                avatar: images,
                // colortypeone: JSON.parse(colortypeone),
                // colortypetwo: JSON.parse(colortypetwo),
                // colortypethree: JSON.parse(colortypethree)
            }, {
                headers: { Authorization: token }
            })
            setShow(false)
            setCallback(!callback)
            toast.success("Susscess !!!")

        } catch (err) {
            toast.error(err.response.data.msg)
            console.log(err)
        }
    }

    //

    const handleChangeInput = e => {
        const { name, value } = e.target
        setProduct({ ...product, [name]: value })
    }

    // submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!isAdmin) {
                toast.error("You're not an admin")
            }
            if (!images) {
                toast.error("No avatar Upload")
            }

            await Axios.put(`/api/products/${product._id}`, {
                name: product.name,
                type: product.type,
                money: product.money,
                amount: product.amount,
                energy: product.energy,
                description: markdown.description,
                descriptionHTML: markdown.descriptionHTML,
                specifications: specifications.specifications,
                specificationsHTML: specifications.specificationsHTML,
                avatar: images,
                // colortypeone: JSON.parse(colortypeone),
                // colortypetwo: JSON.parse(colortypetwo),
                // colortypethree: JSON.parse(colortypethree)
            }, {
                headers: { Authorization: token }
            })
            setCallback(!callback)
            history.push("/all-product")
            toast.success("Update Success!")

        } catch (err) {
            toast.error(err.response.data.msg)
            console.log(err)
        }
    }
    //

    const optionEnergy = [
        {
            value: "0", label: "X??ng"
        },
        {
            value: "1", label: "??i???n"
        }
    ]

    //markdown
    const mdParser = new MarkdownIt(/* Markdown-it options */);

    const handleEditorChange = ({ html, text }) => {
        setMarkdown({
            description: text,
            descriptionHTML: html
        })
    }
    //
    //
    const mdParsers = new MarkdownIt(/* Markdown-it options */);

    const handleEditorChanged = ({ html, text }) => {
        setSpecifications({
            specifications: text,
            specificationsHTML: html
        })
    }
    //

    // edit
    //const [onEdit, setOnEdit] = useState(false)


    //

    return (
        <>

            <Modal
                show={show}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Update Image</Modal.Title>
                </Modal.Header>
                <Modal.Body className='text-danger'>
                    ???nh b???n ???? x??a th??nh c??ng !!!
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleSubmitImage} type="submit">K???t th??c</Button>
                </Modal.Footer>
            </Modal>

            <div className='profile_item_body'>
                {loading ? <Loading2 /> :
                    <div className='profile_item_info col-12 d-flex'>
                        <div className='form-create-product-car col-12'>
                            <div className='profile_item_form'>
                                <div className='form-row'>
                                    <div className='form col-12 mt-4'>
                                        <div className="input-group">
                                            <div className="input-group-prepend ">
                                                <span className="input-group-text boderr " id="inputGroupPrepend1"><i className="fa fa-user d-flex"></i></span>
                                            </div>
                                            <input type="text" className="form-controls col-11" name="name" id="name" placeholder="T??n xe" defaultValue={product.name} onChange={handleChangeInput} />
                                        </div>
                                    </div>
                                </div>
                                <div className='form-row'>
                                    <div className='form col-12 mt-4'>
                                        <div className="input-group">
                                            <div className="input-group-prepend ">
                                                <span className="input-group-text boderr" id="inputGroupPrepend1"><i className="fa-solid fa-bars d-flex"></i></span>
                                            </div>
                                            {/* <input type="text" className="form-controls col-11" name="type" id="type" placeholder="Lo???i xe" defaultValue={product.type}/> */}
                                            <select className="custom-selects col-4" name="type" id="type" defaultValue={product.type} onChange={handleChangeInput}>
                                                <option value="">H??y ch???n lo???i xe</option>
                                                {categories.map((category) => (
                                                    <option key={category._id} value={category._id} selected={product.type === category._id}>
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </select>

                                        </div>
                                    </div>
                                </div>
                                <div className='form-row'>
                                    <div className='form col-12 mt-4'>
                                        <div className="input-group">
                                            <div className="input-group-prepend ">
                                                <span className="input-group-text boderr" id="inputGroupPrepend1"><i className="fa-solid fa-money-bill d-flex"></i></span>
                                            </div>
                                            <input type="number" className="form-controls col-11" name="money" id="money" placeholder="Gi?? b??n" defaultValue={product.money} onChange={handleChangeInput} />
                                        </div>
                                    </div>
                                </div>
                                <div className='form-row'>
                                    <div className='form col-12 mt-4'>
                                        <div className="input-group">
                                            <div className="input-group-prepend ">
                                                <span className="input-group-text boderr" id="inputGroupPrepend1"><i className="fa-solid fa-charging-station d-flex"></i></span>
                                            </div>
                                            {/* <input type="text" className="form-controls col-11" name="energy" id="energy" placeholder="Energy" /> */}
                                            <select className="custom-selects col-4" name="energy" id="energy" defaultValue={product.energy} onChange={handleChangeInput}>
                                                <option value="">H??y ch???n lo???i n??ng l?????ng</option>
                                                {optionEnergy.map((option) => (
                                                    <option key={option.value} value={option.value} selected={product.energy == option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className='form-row'>
                                    <div className='form col-12 mt-4'>
                                        <div className="input-group">
                                            <div className="input-group-prepend ">
                                                <span className="input-group-text boderr" id="inputGroupPrepend1"><i className="fa-solid fa-list-ol d-flex"></i></span>
                                            </div>
                                            <input type="number" className="form-controls col-11" name="amount" id="amount" placeholder="S??? l?????ng" defaultValue={product.amount} onChange={handleChangeInput} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='suggestions col-12 pt-5 pl-0'>
                                <button className="input-group-prepend pl-0"
                                    onClick={() => setOpen(!open)}
                                    aria-controls="example-collapse-text"
                                    aria-expanded={open}>
                                    <span className="input-group-text boderr" id="inputGroupPrepend1"><i className="fa-solid fa-image d-flex"></i></span>
                                    <div className='suggestions-title d-flex'>
                                        L???a ch???n h??nh ???nh, ?????i di???n cho s???n ph???m c???a m??nh
                                    </div>
                                    <i className="fa-solid fa-caret-down d-flex pl-3"></i>
                                </button>
                                <div className='noted col-6 d-flex'>
                                    <p> * D???ng l?????ng file t???i ??a 1 MB</p>
                                    <p>  * ?????nh d???ng:.JPEG, .PNG</p>
                                </div>
                            </div>
                            <Collapse in={open}>
                                <div className='collapse-image'>
                                    <div className='image-product col-12 d-flex pt-3'>
                                        <div className='profile_item_avatars'>
                                            <div className='profile_item_avatar_product col-3'>
                                                <img src={imageUser} alt="" />
                                                <span className='spans'>
                                                    <i className="fa-solid fa-camera"></i>
                                                    <input type="file" name='file' id="file_up" multiple onChange={changeUpload} accept="image/*" />
                                                </span>
                                            </div>
                                            <div className='custom-all-img col-9 d-flex'>
                                                <div className='row img-up mx-0'>
                                                    {
                                                        images.map((img, index) => (
                                                            <div key={index} className="file_img my-1">
                                                                <img src={img.url ? img.url : URL.createObjectURL(img)} alt="1" className='img-thumbnail rounded' />
                                                                <span disabled={loading} onClick={() => deleteImage(img.public_id, index)}>X</span>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Collapse>
                            <div className='profile_item_form'>
                                <div className='form-row'>
                                    <div className='form col-12 pt-5'>
                                        <div className='input-group'>
                                            <div className="input-group-prepend ">
                                                <span className="input-group-text boderr" id="inputGroupPrepend1"><i className="fa-solid fa-pen d-flex"></i></span>
                                            </div>
                                            {/* name='description' value={product.description} onChange={handleChangeInput} */}
                                            <div className="form-control description col-11" >
                                                <div className='description-title'>description</div>
                                                <div className='description-note'><i>M?? t??? chi ti???t s???n ph???m</i></div>
                                                <MdEditor style={{ height: '500px' }} renderHTML={text => mdParser.render(text)} value={markdown.description} onChange={handleEditorChange} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='profile_item_form'>
                                <div className='form-row'>
                                    <div className='form col-12 pt-5'>
                                        <div className='input-group'>
                                            <div className="input-group-prepend ">
                                                <span className="input-group-text boderr" id="inputGroupPrepend1"><i className="fa-solid fa-pen d-flex"></i></span>
                                            </div>
                                            {/* name='description' value={product.description} onChange={handleChangeInput} */}
                                            <div className="form-control description col-11" >
                                                <div className='description-title'>specifications</div>
                                                <div className='description-note'><i>M?? t??? th??ng s??? k??? thu???t</i></div>
                                                <MdEditor style={{ height: '500px' }} renderHTML={text => mdParsers.render(text)} value={specifications.specifications} onChange={handleEditorChanged} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='col-12 d-flex justify-content-center pt-4'>
                                <button className="btn btn-danger btn-block mb-4 col-4 " disabled={loading} onClick={handleSubmit} type='submit'>Update</button>
                            </div>
                        </div >
                    </div>
                }
            </div >

        </>
    )
}

export default EditProduct