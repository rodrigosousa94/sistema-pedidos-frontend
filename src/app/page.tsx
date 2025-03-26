import styles from './page.module.scss'
import LogoImg from '../../public/logo.png'
import Image  from 'next/image'
import Link from 'next/link'
import { api } from '@/services/api'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'


export default function Page(){

  async function handleLogin(formData: FormData){
    "use server"
    const email = formData.get("email")
    const password = formData.get("password")

    if(email === "" || password === ""){
      return
    }

    try {
      const response = await api.post("/session", {
        email,
        password
      })

      if(!response.data.token){
        return
      }

      const expressTime = 60 * 60 * 24 * 30 * 1000
      const cookieStore = await cookies()

      cookieStore.set("session", response.data.token, {
        maxAge: expressTime,
        path: "/",  // significa que o cookie estará disponível em todo o site, ou seja, ele será acessível em todas as URLs dentro do domínio.
        httpOnly: false,
        secure: process.env.NODE_ENV === "production"
      })
      
    } catch (err) {
      console.log("Error " + err)
      return
    }

    redirect('/dashboard')
  }

  return(
    <>
      <div className={styles.containerCenter}>
        <Image src={LogoImg} className={styles.logo} alt="logo"/>
      
      <section className={styles.login}>
        <form action={handleLogin}>
          <input className={styles.input} type="email" required name='email' placeholder='Digite seu email'/>
          <input className={styles.input} type="password" required name='password' placeholder='***********'/>
          <button type='submit' className={styles.button}>Acessar</button>
        </form>

        <Link className={styles.text} href="/signup">Não possui uma conta? Cadastre-se aqui!</Link>
      </section>
      </div>
    </>
  )
}