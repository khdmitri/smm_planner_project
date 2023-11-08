import {Disclosure} from '@headlessui/react';
import Link from 'next/link';
import React, {useEffect, useState} from 'react';
import {Bars3Icon} from '@heroicons/react/24/outline';
import Drawer from "./Drawer";
import Drawerdata from "./Drawerdata";
import Signdialog from "./Signdialog";
import Registerdialog from "./Registerdialog";
import {Box, Button} from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import {useRouter} from "next/navigation";
import LogoutIcon from '@mui/icons-material/Logout';


interface NavigationItem {
    name: string;
    href: string;
    current: boolean;
}

const navigation: NavigationItem[] = [
    {name: 'Home', href: '#/', current: true},
    {name: 'Applicability', href: '#courses', current: false},
    {name: 'Get started', href: '#mentor', current: false},
];

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

const CustomLink = ({href, onClick, children}: { href: string; onClick: () => void; children: React.ReactNode }) => {
    return (
        <Link href={href} passHref>
            <span
                onClick={onClick}
                className="px-3 py-4 text-lg font-normal"
            >
                {children}
            </span>
        </Link>
    );
};

const logout = () => {
    sessionStorage.removeItem("user")
}


const Navbar = () => {
    const navigate = useRouter()
    const [isOpen, setIsOpen] = React.useState(false);
    const [user, setUser] = useState("")

    const [currentLink, setCurrentLink] = useState('/');

    const handleLinkClick = (href: string) => {
        setCurrentLink(href);
    };

    useEffect(() => {
        setUser(JSON.parse(sessionStorage.getItem("user") || ""))
    }, [])

    return (
        <Disclosure as="nav" className="navbar">
            <>
                <div className="mx-auto max-w-7xl px-6 py-4 lg:px-8">
                    <div className="relative flex h-12 md:h-20 items-center justify-between">
                        <div className="flex flex-1 items-center sm:items-stretch sm:justify-start">

                            {/* LOGO */}

                            <div className="flex flex-shrink-0 items-center">
                                <img
                                    className="block h-12 w-40 lg:hidden"
                                    src={'/assets/logo/logo.png'}
                                    alt="dsign-logo"
                                />
                                <img
                                    className="hidden h-full w-full lg:block"
                                    src={'/assets/logo/logo.png'}
                                    alt="dsign-logo"
                                />
                            </div>

                            {/* LINKS */}

                            <div className="hidden lg:block m-auto">
                                <div className="flex space-x-4">
                                    {navigation.map((item) => (
                                        <CustomLink
                                            key={item.name}
                                            href={item.href}
                                            onClick={() => handleLinkClick(item.href)}
                                        >
                                            <span
                                                className={classNames(
                                                    item.href === currentLink ? 'underline-links' : 'text-slategray',
                                                    'px-3 py-4 text-lg font-normal opacity-75 hover:opacity-100'
                                                )}
                                                aria-current={item.href ? 'page' : undefined}
                                            >
                                                {item.name}
                                            </span>
                                        </CustomLink>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {user !== "" ?
                            <>
                                <Box>
                                    <Button startIcon={<PersonIcon/>}
                                            onClick={() => navigate.push("/profile")}>
                                        Profile
                                    </Button>
                                    &nbsp;&nbsp;
                                    <Button variant="outlined"
                                            startIcon={<LogoutIcon/>}
                                            onClick={logout}>
                                        Logout
                                    </Button>
                                </Box>
                            </>
                            :
                            <>
                                <Signdialog/>
                                <Registerdialog/>
                            </>
                        }


                        {/* DRAWER FOR MOBILE VIEW */}

                        {/* DRAWER ICON */}

                        <div className='block lg:hidden'>
                            <Bars3Icon className="block h-6 w-6" aria-hidden="true" onClick={() => setIsOpen(true)}/>
                        </div>

                        {/* DRAWER LINKS DATA */}

                        <Drawer isOpen={isOpen} setIsOpen={setIsOpen}>
                            <Drawerdata/>
                        </Drawer>


                    </div>
                </div>
            </>
        </Disclosure>
    );
};

export default Navbar;
