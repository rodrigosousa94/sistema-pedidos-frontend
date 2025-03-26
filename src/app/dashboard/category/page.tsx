import styles from './styles.module.scss'
import { Button } from '../components/button'
import { api } from '@/services/api'
import { getCookieServer } from '@/lib/cookieServer'
import { redirect } from 'next/navigation'


export default function Category(){

    async function handleRegisterCategory(formData: FormData){
        "use server"

        const name = formData.get("name")
        if(name === ""){
            return
        }

        const token = await getCookieServer()

        try {
             await api.post("/category", {
                name,
            }, {
                headers: {
                    Authorization: token
                }
            })
            
            
        } catch (error) {
            console.log(error)
            return
        }
        
        redirect("/")
    }

    return(
        <main className={styles.container}>
            <h1>Nova Categoria</h1> 

            <form action={handleRegisterCategory} className={styles.form}>
                <input className={styles.input} type="text" name='name' placeholder='Nome da categoria, ex: Bebidas' required/>
                <Button name="Cadastrar"/>
            </form>
        </main>
    )
}