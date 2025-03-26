"use client"
import { ChangeEvent, useState } from 'react'
import styles from './styles.module.scss'
import { UploadCloud } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/app/dashboard/components/button'
import { api } from '@/services/api'
import { getCookieClient } from '@/lib/cookieClient'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'



interface CategoryProps {
    id: string;
    name: string;
}

interface FormProps {
    categories: CategoryProps[]
}

export function Form({ categories }: FormProps){
    const router = useRouter()
    const [image, setImage] = useState<File>()
    const [previewImage, setPreviewImage] = useState("")

    function handleFile(e: ChangeEvent<HTMLInputElement>){
        if(e.target.files && e.target.files[0]){
            const image = e.target.files[0]

            if(image.type !== "image/jpeg" && image.type !== "image/png"){
                toast.warning("Apenas formatos .JPEG e .PNG são permitidos")
                return
            }

            setImage(image)
            setPreviewImage(URL.createObjectURL(image))
        
            
        }
    }

    async function handleRegisterProduct(formData: FormData){

        
        
        const categoryIndex = formData.get("category")
        const name = formData.get("name")
        const price = formData.get("price")
        const description = formData.get("description")

        if(!name || !categoryIndex || !price || !description || !image){
            toast.warning("Preencha todos os campos!")
            return
        }

        const data = new FormData() // É preciso enviar FORMDATA pq estamos enviando um file

        data.append("name", name)
        data.append("price", price)
        data.append("description", description)
        data.append("category_id", categories[Number(categoryIndex)].id)
        data.append("file", image)

        const token = await getCookieClient()

        await api.post("/product", data, {
            headers: {
                Authorization: token
            }
        })
        .catch((err) => {
            console.log('erro' + err)
            toast.warning("Houve um erro ao registrar o produto")
            return
        })

        toast.success("Produto registrado com sucesso")
        router.push("/dashboard")
        
    }
    

    return(
        <main className={styles.container}>
            <h1>Novo Produto</h1>

            <form action={handleRegisterProduct} className={styles.form}>
                <label className={styles.labelImage}>
                    <span>
                        <UploadCloud size={30} color='#8B4513'/>
                    </span>

                    <input type="file" accept='image/png, image/jpeg' required onChange={handleFile}/>
                    
                        {previewImage && (
                            <Image alt='imagem-preview' src={previewImage} className={styles.preview} fill={true} quality={100} priority={true}/>
                        )}        
                </label>    

                <select name="category">
                        {categories.map((categorie, index) => (
                            <option key={categorie.id} value={index}>
                                {categorie.name}
                            </option>
                        ))}
                </select>

                <input className={styles.input} type="text" name='name' placeholder='Digite o nome do produto' required/>
                <input className={styles.input} type="text" name='price' placeholder='Digite o preço do produto' required/>
                <textarea className={styles.input} name='description' placeholder='Digite a descrição do produto' required></textarea>      
                 <Button name='Cadastrar Produto'/>
            </form>
        </main>
    )
}