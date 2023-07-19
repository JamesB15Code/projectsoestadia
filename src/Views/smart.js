import React, { useState } from 'react'


export default function Smart() {

    const [image, setImage] = useState('');
    const [loading, setLoading] = useState(false);

    const uploadImage = async (e) => {
        const files = e.target.files;
        const data = new FormData();
        data.append("file", files[0]);
        data.append("upload_preset", "prueba");
        setLoading(true);
        const res = await fetch(
            "https://api.cloudinary.com/v1_1/dchgfutbv/image/upload",
            {
                method: "POST",
                body: data,
            }
        )
        const file = await res.json();
        setImage(file.secure_url)
        console.log(file.secure_url)
        setLoading(false)
    }

    return (
        <div>
        <h1>smart</h1>

        <input
            type="file" 
            name="file" 
            placeholder="Sube tu imagen aqui"
            onChange={uploadImage}
        />
        </div>
    )
}
