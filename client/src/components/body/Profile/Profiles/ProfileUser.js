import React, { useEffect, useState } from 'react'
import '../Profiles/ProfileUser.scss'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, Route, Switch, BrowserRouter as Router } from 'react-router-dom'
import { dispatchGetAllUsers, fetchAllUsers } from '../../../../redux/action/userAction'
import ProfileItem from './ProfileItem'
import NotFound from '../../../utils/NotFound/NotFound'
import ProfileAllUser from '../Profiles/AdminManager/ProfileAllUser'
import EditRoleUser from './AdminManager/EditRoleUser'
import ChangePassword from '../ChangePassword/ChangePassword'
import CategoryCar from './CategoryCar/CategoryCar'
import CreateProduct from './ProductCarAdmin/CreateProduct'

import Address from '../Address/Address'
import ProductCarAdmin from './ProductCarAdmin/ProductCarAdmin'
import EditProduct from './ProductCarAdmin/EditProduct'


function ProfileUser() {
    const auth = useSelector(state => state.auth)
    const token = useSelector(state => state.token)

    const { user, isAdmin, isLogged } = auth
    const [avatar, setAvatar] = useState(false)

    const [callback, setCallback] = useState(false)

    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);

    const dispatch = useDispatch()

    useEffect(() => {
        if (isAdmin) {
            fetchAllUsers(token).then(res => {
                dispatch(dispatchGetAllUsers(res))
            })
        }
    }, [token, isAdmin, dispatch, callback])


    return (
        <>
            <div className='profile_page'>
                <div className='container'>
                    <div className='profile_page_body'>
                        <div className='row'>
                            <Router basename='/profile'>
                                <div style={{ width: isOpen ? "25%" : "9%" }} className='profile_item_controll' >
                                    <div className='profile_item-avatar' style={{ justifyContent: isOpen ? "start" : "center" }} onClick={toggle}>
                                        <img src={avatar ? avatar : user.avatar} alt="" />
                                        <div className='infor_profile' style={{ display: isOpen ? "" : "none" }}>
                                            <h2>{isAdmin ? "Admin Profile" : "User Profile"}</h2>
                                            <p>{user.name}</p>
                                        </div>
                                    </div>
                                    <div className='profile_item-infor'>
                                        <div className='infor' style={{ alignItems: isOpen ? "flex-start" : "center" }}>
                                            <NavLink to="/profileuser" className={({ isActive }) => (isActive ? 'profile pb-2 active' : 'profile pb-2')} style={{ width: isOpen ? "220px" : "48px" }}><i className="fa-solid fa-user"></i><span style={{ display: isOpen ? "" : "none" }}>profile</span></NavLink>
                                            <NavLink to="/address" className={({ isActive }) => (isActive ? 'address pb-2 active' : 'address pb-2')} style={{ width: isOpen ? "220px" : "48px" }}><i className="fa-solid fa-location-dot"></i><span style={{ display: isOpen ? "" : "none" }}>address</span></NavLink>
                                            <NavLink to="/changePassword" className={({ isActive }) => (isActive ? 'changePassword pb-2 active' : 'changePassword pb-2')} style={{ width: isOpen ? "220px" : "48px" }}><i className="fa-solid fa-key"></i><span style={{ display: isOpen ? "" : "none" }}>changePassword</span></NavLink>
                                        </div>
                                        <div className='infor_additional' style={{ alignItems: isOpen ? "flex-start" : "center" }}>
                                            <a href="#" className='order pb-2'><i className="fa-solid fa-cart-shopping"></i><span style={{ display: isOpen ? "" : "none" }}>order</span></a>
                                            <a href="#" className='bank pb-2'><i className="fa-sharp fa-solid fa-building-columns"></i><span style={{ display: isOpen ? "" : "none" }}>bank</span></a>
                                            <a href="#" className='notification pb-2'><i className="fa-solid fa-bell"></i><span style={{ display: isOpen ? "" : "none" }}>notification</span></a>
                                        </div>
                                    </div>
                                </div>
                                <div className='profile_item' style={{ width: isOpen ? "74%" : "89%" }}>
                                    <div className='profile_item_header pt-3'>
                                        <h3>H??? S?? C???a T??i</h3>
                                        <p>Qu???n l?? th??ng tin h??? s?? ????? b???o m???t t??i kho???n</p>
                                    </div>
                                    <Switch>
                                        <Route path="/profileuser" component={isLogged ? ProfileItem : NotFound} exact />
                                        <Route path="/all-user" component={isAdmin ? ProfileAllUser : NotFound} exact />
                                        <Route path="/edit_user/:id" component={isAdmin ? EditRoleUser : NotFound} exact />
                                        <Route path="/address" component={isLogged ? Address : NotFound} exact />
                                        <Route path="/changePassword" component={isLogged ? ChangePassword : NotFound} exact />
                                        <Route path="/all-category" component={isAdmin ? CategoryCar : NotFound} exact />
                                        <Route path="/all-product" component={isAdmin ? ProductCarAdmin : NotFound} exact />
                                        <Route path="/create-product" component={isAdmin ? CreateProduct : NotFound} exact />
                                        <Route path="/edit-product/:id" component={isAdmin ? EditProduct : NotFound} exact />
                                    </Switch>
                                </div>
                            </Router>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProfileUser