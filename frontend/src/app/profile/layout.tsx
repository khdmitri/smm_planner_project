import MenuLayer from "@/app/menu";

export default function ProfileLayout(props) {
    const {children} = props;
    return (
        <>
            {/*<MenuLayer/>*/}
            <div className="paddingTop"></div>
            {children}
        </>
    )
}