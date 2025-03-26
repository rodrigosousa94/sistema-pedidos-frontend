import styles from './page.module.scss'
import LogoImg from '../../../public/logo.png'
import Image  from 'next/image'
import Link from 'next/link'
import { api } from '@/services/api'
import { redirect } from 'next/navigation'

export default function Signup(){

  async function handleRegister(formData: FormData){
    "use server"

    const name = formData.get("name")
    const email = formData.get("email")
    const password = formData.get("password")

    if(name === "" || email === "" || password === ""){
      return
    }

    try{
      await api.post("/users", {
        name,
        email,
        password
      })
    }catch(err){
      console.log("error " + err)
      return
    }

    redirect('/')
    
  }

  return(
    <>
      <div className={styles.containerCenter}>
        <Image src={LogoImg} className={styles.logo} alt="logo"/>
      
      <section className={styles.signup}>
        <form action={handleRegister}>
          <input className={styles.input} type="text" required name='name' placeholder='Digite seu nome'/>
          <input className={styles.input} type="email" required name='email' placeholder='Digite seu email'/>
          <input className={styles.input} type="password" required name='password' placeholder='***********'/>
          <button type='submit' className={styles.button}>Cadastrar</button>
        </form>

        <Link className={styles.text} href="/">Já possui uma conta? Acesse aqui!</Link>
      </section>
      </div>
    </>
  )
}