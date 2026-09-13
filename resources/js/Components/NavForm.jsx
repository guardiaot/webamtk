import React from 'react';
import { Link } from "@inertiajs/react";
import { useState } from "react";

export default function NavForm({ active = false, className = '', children, ...props }) {

        const [menuUser, setMenuUser] = useState(false)
        const [show, setShow] = useState('')
        const [mstatic, setStatic] = useState('')

        const [menuCard, setMenuCard] = useState(false)
        const [showcard, setShowcard] = useState('')
        const [cstatic, setCstatic] = useState('')

        const [profile, setProfile] = useState(false)
        const [showProfile, setShowProfile] = useState('')
        const [pstatic, setPstatic] = useState('')

        const openProfile = () => {
                setProfile(!profile)
                if (!profile) {
                        setShowProfile('show')
                        setPstatic('static')
                } else {
                        setShowProfile('')
                        setPstatic('')
                }
        }

        const menuOpen = () => {
                setMenuUser(!menuUser)
                if (!menuUser) {
                        setShow('show')
                        setStatic('static')
                } else {
                        setShow('')
                        setStatic('')
                }
        }

        const menuCards = () => {
                setMenuCard(!menuCard)
                if (!menuCard) {
                        setShowcard('show')
                        setCstatic('static')
                } else {
                        setShowcard('')
                        setCstatic('')
                }
        }


        return (
                <>
                        <ul className="navbar-nav ms-auto">
                                <li className="nav-item dropdown"  >
                                        <a className={`nav-link count-indicator ${show}`} id="notificationDropdown" href="#" data-bs-toggle="dropdown" aria-expanded={menuUser} onClick={menuOpen}>
                                                <i className="icon-bell"></i>
                                                <span className="count"></span>
                                        </a>
                                        <div className={`dropdown-menu dropdown-menu-right navbar-dropdown preview-list pb-0 ${show}`} aria-labelledby="notificationDropdown" data-bs-popper={mstatic}>
                                                <a className="dropdown-item py-3 border-bottom">
                                                        <p className="mb-0 fw-medium float-start">You have 4 new notifications </p>
                                                        <span className="badge badge-pill badge-primary float-end">View all</span>
                                                </a>
                                                <a className="dropdown-item preview-item py-3">
                                                        <div className="preview-thumbnail">
                                                                <i className="mdi mdi-alert m-auto text-primary"></i>
                                                        </div>
                                                        <div className="preview-item-content">
                                                                <h6 className="preview-subject fw-normal text-dark mb-1">Application Error</h6>
                                                                <p className="fw-light small-text mb-0"> Just now </p>
                                                        </div>
                                                </a>
                                                <a className="dropdown-item preview-item py-3">
                                                        <div className="preview-thumbnail">
                                                                <i className="mdi mdi-lock-outline m-auto text-primary"></i>
                                                        </div>
                                                        <div className="preview-item-content">
                                                                <h6 className="preview-subject fw-normal text-dark mb-1">Settings</h6>
                                                                <p className="fw-light small-text mb-0"> Private message </p>
                                                        </div>
                                                </a>
                                                <a className="dropdown-item preview-item py-3">
                                                        <div className="preview-thumbnail">
                                                                <i className="mdi mdi-airballoon m-auto text-primary"></i>
                                                        </div>
                                                        <div className="preview-item-content">
                                                                <h6 className="preview-subject fw-normal text-dark mb-1">New user registration</h6>
                                                                <p className="fw-light small-text mb-0"> 2 days ago </p>
                                                        </div>
                                                </a>
                                        </div>
                                </li>
                                <li className="nav-item dropdown">
                                        <a className={`nav-link count-indicator ${showcard}`} id="countDropdown" href="#" data-bs-toggle="dropdown" aria-expanded={menuCard} onClick={menuCards} >
                                                <i className="icon-mail icon-lg"></i>
                                        </a>
                                        <div className={`dropdown-menu dropdown-menu-right navbar-dropdown preview-list pb-0 ${showcard}`} aria-labelledby="countDropdown" data-bs-popper={cstatic}>
                                                <a className="dropdown-item py-3">
                                                        <p className="mb-0 fw-medium float-start">You have 7 unread mails </p>
                                                        <span className="badge badge-pill badge-primary float-end">View all</span>
                                                </a>
                                                <div className="dropdown-divider"></div>
                                                <a className="dropdown-item preview-item">
                                                        <div className="preview-thumbnail">
                                                                <img src="assets/images/faces/face10.jpg" alt="image" className="img-sm profile-pic" />
                                                        </div>
                                                        <div className="preview-item-content flex-grow py-2">
                                                                <p className="preview-subject ellipsis fw-medium text-dark">Marian Garner </p>
                                                                <p className="fw-light small-text mb-0"> The meeting is cancelled </p>
                                                        </div>
                                                </a>
                                                <a className="dropdown-item preview-item">
                                                        <div className="preview-thumbnail">
                                                                <img src="assets/images/faces/face12.jpg" alt="image" className="img-sm profile-pic" />
                                                        </div>
                                                        <div className="preview-item-content flex-grow py-2">
                                                                <p className="preview-subject ellipsis fw-medium text-dark">David Grey </p>
                                                                <p className="fw-light small-text mb-0"> The meeting is cancelled </p>
                                                        </div>
                                                </a>
                                                <a className="dropdown-item preview-item">
                                                        <div className="preview-thumbnail">
                                                                <img src="assets/images/faces/face1.jpg" alt="image" className="img-sm profile-pic" />
                                                        </div>
                                                        <div className="preview-item-content flex-grow py-2">
                                                                <p className="preview-subject ellipsis fw-medium text-dark">Travis Jenkins </p>
                                                                <p className="fw-light small-text mb-0"> The meeting is cancelled </p>
                                                        </div>
                                                </a>
                                        </div>
                                </li>
                                <li className="nav-item dropdown d-none d-lg-block user-dropdown">
                                        <a className={`nav-link ${showProfile}`} id="UserDropdown" href="#" data-bs-toggle="dropdown" aria-expanded={profile} onClick={openProfile}>
                                                <img className="img-xs rounded-circle" src="assets/images/faces/face8.jpg" alt="Profile image" /> </a>
                                        <div className={`dropdown-menu dropdown-menu-right navbar-dropdown ${showProfile}`} aria-labelledby="UserDropdown" data-bs-popper={pstatic} >
                                                <div className="dropdown-header text-center">
                                                        <img className="img-md rounded-circle" src="assets/images/faces/face8.jpg" alt="Profile image" />
                                                        <p className="mb-1 mt-3 fw-semibold">Allen Moreno</p>
                                                        <p className="fw-light text-muted mb-0">allenmoreno@gmail.com</p>
                                                </div>
                                                <a className="dropdown-item"><i className="dropdown-item-icon mdi mdi-account-outline text-primary me-2"></i> My Profile <span className="badge badge-pill badge-danger">1</span></a>
                                                <a className="dropdown-item"><i className="dropdown-item-icon mdi mdi-message-text-outline text-primary me-2"></i> Messages</a>
                                                <a className="dropdown-item"><i className="dropdown-item-icon mdi mdi-calendar-check-outline text-primary me-2"></i> Activity</a>
                                                <a className="dropdown-item"><i className="dropdown-item-icon mdi mdi-help-circle-outline text-primary me-2"></i> FAQ</a>
                                                <a className="dropdown-item"><i className="dropdown-item-icon mdi mdi-power text-primary me-2"></i>Sign Out</a>
                                        </div>
                                </li>
                        </ul>
                </>
        )
}