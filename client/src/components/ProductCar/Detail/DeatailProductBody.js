import Axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import './DetailBody.scss'

import { Link, animateScroll as scroll } from 'react-scroll'

import SimpleReactLightbox, { SRLWrapper } from 'simple-react-lightbox'
import Slider from "react-slick";
import "../../../../node_modules/slick-carousel/slick/slick.css";
import "../../../../node_modules/slick-carousel/slick/slick-theme.css";

// date range picker
import 'antd/dist/antd.min.css';
import { DatePicker } from 'antd';
import moment from 'moment';
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
const { RangePicker } = DatePicker;
//


const initialState = {
    smoney1: 291480000, smoney2: 1560000, smoney3: 437000, smoney4: 20000000, smoney5: 340000
}

function DeatailProductBody() {

    const auth = useSelector(state => state.auth)
    const { isLogged, user } = auth
    const token = useSelector(state => state.token)
    const history = useHistory()

    const param = useParams()
    const [detailItem, setDetailItem] = useState([])

    const [avatar, setAvatar] = useState(false);
    const [colortypeone, setColortypeone] = useState(false);
    const [colortypetwo, setColortypetwo] = useState(false);
    const [colortypethree, setColortypethree] = useState(false);

    const [sumMoney, setSumMoney] = useState(initialState)


    const [tab, setTab] = useState(0)

    // nametype
    const [nametypes, setNametypes] = useState([])
    const [callback, setCallback] = useState(false)

    useEffect(() => {
        const getNameType = async () => {
            const res = await Axios.get('/api/nametype')
            setNametypes(res.data)
        }
        getNameType()
    }, [callback])

    console.log(nametypes)

    //

    useEffect(() => {
        if (param.id) {
            nametypes.forEach(nametype => {
                if (nametype._id == param.id) {
                    setDetailItem(nametype)
                }
            });
        }
    }, [param, nametypes, callback])

    console.log(detailItem)

    console.log(detailItem.avatar)

    const [click, setClick] = useState(false)
    const closemenu = () => setClick(false)

    const handleClick = () => {
        setClick(!click)
    }

    //see more

    //

    const settings = {
        infinite: false,
        speed: 500,
        autoplaySpeed: 3000,
        autoplay: true,
        slidesToShow: 3,
        slidesToScroll: 1
    };

    const formatMoney = Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(detailItem.money)

    //date range picker
    const [dates, setDates] = useState("")

    //

    //money

    const money1 = Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(sumMoney.smoney1)
    const money2 = Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(sumMoney.smoney2)
    const money3 = Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(sumMoney.smoney3)
    const money4 = Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(sumMoney.smoney4)
    const money5 = Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(sumMoney.smoney5)



    const tien = Number(detailItem.money)

    const sum = tien + sumMoney.smoney1 + sumMoney.smoney2 + sumMoney.smoney3 + sumMoney.smoney4 + sumMoney.smoney5

    const formatTien = Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(sum)


    // submit lai thu
    const handleSubmit = async (e) => {
        try {
            // e.preventDefault();
            if (!isLogged) {
                toast.error("Please login to proceed with registration!!!")
                history.push("/login")
            }

            if (!dates) {
                toast.error("Please choose a test drive date!!!")
            }
            else {
                await Axios.post("/api/laithu", {
                    nameUser: user.name,
                    email: user.email,
                    idUser: user._id,
                    name: detailItem.name,
                    type: detailItem.type.name,
                    money: detailItem.money,
                    smoney1: sumMoney.smoney1,
                    smoney2: sumMoney.smoney2,
                    smoney3: sumMoney.smoney3,
                    smoney4: sumMoney.smoney4,
                    smoney5: sumMoney.smoney5,
                    sum: sum,
                    date: dates
                }, {
                    headers: { Authorization: token }
                })

                history.push("/")
                toast.success("Create Success!")
            }

        } catch (err) {
            toast.error(err.response.data.msg)
            console.log(err)
        }
    }
    //

    return (
        <>
            <SimpleReactLightbox>
                <div className='detail-product-car'>
                    <div className='container'>
                        <div className='row'>
                            <div className='DetailProduct'>
                                <div className='DetailProduct-header d-flex col-12'>
                                    <div className='DetailProduct-header-overview'>
                                        <div className='overview-name'>
                                            <span className='name-car'>
                                                {detailItem.name}
                                            </span>
                                            <span className='LoaiXe'>
                                                {
                                                    detailItem
                                                    && detailItem.type
                                                    && detailItem.type.name
                                                    && <span>{detailItem.type.name}</span>
                                                }
                                            </span>
                                        </div>
                                        <div className='overview-money'>
                                            <span className='price-range mr-2'>Kho???ng gi??:</span>
                                            <span className='money-car'>{formatMoney}</span>
                                        </div>
                                    </div>
                                    <div className='DetailProduct-header-controll'>
                                        <Link className="control-overview" activeClass='active' to="TongQuan" spy={true} offset={-330} smooth={true} duration={500} >T???ng quan</Link>
                                        <Link className="control-overview" activeClass='active' to="ChiTiet" spy={true} offset={-270} smooth={true} duration={500} >Chi ti???t</Link>
                                        <Link className="control-overview" activeClass='active' to="ThongSoKyThuat" spy={true} offset={-270} smooth={true} duration={500} >Th??ng s??? k??? thu???t</Link>
                                    </div>
                                </div>
                                <div className='DetailProduct-body d-flex col-12'>
                                    <div className='DetailProduct-body-car col-8'>
                                        <div className='DetailProduct-TongQuan-name'>
                                            <div className='DetailProduct-TongQuan' id='TongQuan'>
                                                <div className='title-detailProduct'>
                                                    <span>
                                                        T???ng Quan
                                                    </span>
                                                </div>

                                                <div className='DetailProduct-TongQuan-img'>
                                                    <img src={detailItem.avatar?.[0].url} />
                                                </div>
                                                <SRLWrapper>
                                                    <Slider className='DetailProduct-TongQuan-img-mini' {...settings}>
                                                        {
                                                            detailItem.avatar?.map((img, index) => (
                                                                <img key={index} src={img.url} alt={img.url} />
                                                            ))
                                                        }
                                                    </Slider>
                                                </SRLWrapper>

                                            </div>
                                        </div>
                                        <div className='DetailProduct-TongQuan-money'>
                                            <h3>Gi?? l??n b??nh</h3>
                                            <span>T???i Vi???t Nam, {detailItem.name} ???????c ph??n ph??n ph???i ch??nh h??ng 1 phi??n b???n. Gi?? l??n b??nh tham kh???o nh?? sau:</span>
                                            <div className='DetailProduct-TongQuan-table-money pt-3'>
                                                <table className="table table-bordered">
                                                    <thead className='thead-dark'>
                                                        <tr>
                                                            <th scope="col">#</th>
                                                            <th scope="col">T??n phi??n b???n</th>
                                                            <th scope="col">Gi?? ni??m y???t</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <th scope="row">1</th>
                                                            <td>{detailItem.name}</td>
                                                            <td>{formatMoney}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div className='DetailProduct-ChiTiet-name'>
                                            <span>M?? t??? / ????nh gi?? chi ti???t</span>
                                            <div id='ChiTiet' className='DetailProduct-ChiTiet' dangerouslySetInnerHTML={{ __html: detailItem.descriptionHTML }} />
                                        </div>
                                        <div className='DetailProduct-ThongSoKyThuat-name'>
                                            <span>Th??ng s??? k??? thu???t</span>
                                            <div id='ThongSoKyThuat' className='DetailProduct-ThongSoKyThuat' dangerouslySetInnerHTML={{ __html: detailItem.specificationsHTML }} />
                                        </div>
                                    </div>
                                    <div className='DetailProduct-summary col-4'>
                                        <div className='DetailProduct-summary-name'>
                                            <div className='title-detailProduct'>
                                                <span>H??a ????n</span>
                                            </div>
                                            <div className='detailProduct-body-Receipt'>
                                                <div className='Receipt-body'>
                                                    <div className='Receipt-body-money'>
                                                        <span>Gi?? l??n b??nh</span>
                                                    </div>
                                                    <div className='Receipt-body-select-name pt-2'>
                                                        <span className='input-icons'><i className="fa-solid fa-star icon"></i></span>
                                                        <input type="text" disabled className='Receipt-body-select' value={formatTien} />

                                                    </div>
                                                </div>
                                                <div className='Receipt-body-nameCity'>
                                                    <div className='Receipt-nameCity-name'>
                                                        <span>T??n chi nh??nh</span>
                                                    </div>
                                                    <div className='Receipt-nameCity pt-2'>
                                                        <span className='input-icons'><i className="fa-solid fa-city icon"></i></span>
                                                        <input type="text" disabled className='Receipt-nameCity-input' value="MERCEDES-BENZ-MINH" />
                                                    </div>
                                                </div>
                                                <div className='Money-Receipt'>
                                                    <span className='title-Money-Receipt'>Gi?? ni??m y???t: </span>
                                                    <span>{formatMoney}</span>
                                                </div>
                                            </div>
                                            <div className='Receipt-incurred'>
                                                <table className="table table-bordered">
                                                    <thead className='thead-dark'>
                                                        <tr>
                                                            <th scope="col">D??? t??nh chi ph??</th>
                                                            <th scope="col" className='money-td'>(vn??)</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>Gi?? ni??m y???t:</td>
                                                            <td className='money-td'>{formatMoney}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Ph?? tr?????c b??? (12%):</td>
                                                            <td className='money-td'>{money1}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Ph?? s??? d???ng ???????ng b??? (01 n??m):</td>
                                                            <td className='money-td'>{money2}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>B???o hi???m tr??ch nhi???m d??n s??? (01 n??m):</td>
                                                            <td className='money-td'>{money3}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Ph?? ????ng k?? bi???n s???:</td>
                                                            <td className='money-td'>{money4}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Ph?? ????ng ki???m:</td>
                                                            <td className='money-td'>{money5}</td>
                                                        </tr>
                                                        <tr className='tongtien'>
                                                            <td>T???ng c???ng:</td>
                                                            <td className='money-td'>{formatTien}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className='SetTime-TextCar'>
                                                <div className='SetTime-TextCar-Name'>
                                                    <span>Ch???n ng??y l??i th???</span>
                                                </div>
                                                <div className='SetTime-TextCar-date'>
                                                    {/* <RangePicker onChange={(value) => {
                                                        // const values = moment(value[0]).format('DD-MM-YYYY')
                                                        setDates(value.map(item => {
                                                            return moment(item).format('DD-MM-YYYY')
                                                        }))
                                                    }} /> */}

                                                    <DatePicker onChange={(value) => {
                                                        //const values = moment(value[0]).format('DD-MM-YYYY')
                                                        setDates(value.format('DD-MM-YYYY'))
                                                    }}
                                                        // dateFormat="DD-MM-YYYY" 
                                                        defaultDate={dates} format='DD-MM-YYYY'
                                                    />
                                                </div>
                                            </div>
                                            <div className='Title-note'>
                                                <span><i class="fa-solid fa-circle-exclamation"></i></span> <p>Ngay sau khi nh???n ???????c y??u c???u ch??ng t??i s??? li??n h??? l???i v???i qu?? kh??ch trong th???i gian s???m nh???t.</p>
                                            </div>
                                            <div className='Submit'>
                                                <button type='submit' className='Submit-car' onClick={handleSubmit}>????ng k?? l??i th???</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </SimpleReactLightbox>
        </>
    )
}

export default DeatailProductBody