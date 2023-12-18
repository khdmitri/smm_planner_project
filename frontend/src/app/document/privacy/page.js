import DocumentApi from '../../../lib/document'

async function getData() {
    // const res = await fetch("http://127.0.0.1:8000/api/v1/document/privacy")
    // console.log("RES:", res)
    // if (!res.ok) {
    //     throw new Error(`unexpected response ${res.statusText}`);
    // }
    // return res

    await DocumentApi.privacy().then((response) => {
        //Create a Blob from the PDF Stream
        const file = new Blob([response.data], {type: "application/pdf"});
        //Build a URL from the file
        const fileURL = URL.createObjectURL(file);
        //Open the URL on new Window
        //  const pdfWindow = window.open();
        //  pdfWindow.location.href = fileURL;
        return <object data={fileURL} type="application/pdf" width="100%" height="100%">Text</object>
    }).catch(error => {
        console.log("Error:", error)
    })

}

export default async function Page() {
    await getData()
}