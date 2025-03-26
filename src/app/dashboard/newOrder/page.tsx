import { getCookieServer } from '@/lib/cookieServer'
import { Button } from '../components/button'
import styles from './styles.module.scss'
import { api } from '@/services/api'
import { redirect } from 'next/navigation'


export default async function NewOrder(){

    async function handleOpenTable(formData: FormData){
        "use server"
        const table = Number(formData.get("table"));
        const name = formData.get("name") as string

        console.log("Dados recebidos: ", { table, name });

        if(!table || !name){
            return
        }

        
            const token = await getCookieServer()

        
            const response = await api.post("/order", {
                table: table,
                name
            }, {
                headers: {
                    Authorization: token
                }
            })

            const orderId = response.data.id;

            if(orderId){
                redirect(`/dashboard/newOrder/${orderId}`);
            }
        } 

    
    
    return (
        <main className={styles.container}>
            <h1>Novo pedido</h1>

            <form action={handleOpenTable}  className={styles.form}>
                <input className={styles.input} type="number" placeholder="Digite o número da mesa" name="table" required/>
                <input className={styles.input} type="text" placeholder="Digite o nome do cliente" name="name" required/>
                <Button name="Abrir mesa"/>
            </form>
        </main>
    )
}