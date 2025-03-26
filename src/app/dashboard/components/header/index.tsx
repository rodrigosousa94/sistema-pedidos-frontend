"use client"

import Link from 'next/link'
import styles from './styles.module.scss'
import Image from 'next/image'
import logoImg from '/public/logo.png'
import { LogOutIcon } from 'lucide-react'
import { deleteCookie } from 'cookies-next'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'




export function Header(){

    const router = useRouter()

    async function handleLogout(){
        deleteCookie("session", { path: "/" })
        toast.success("Logout feito com sucesso")
        router.replace("/")
        // deleta o cookie e redireciona o usuario para "/"
    }

    return(
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <Link href="/dashboard">
                    <Image className={styles.logo} src={logoImg} alt='logo' width={80} height={80} priority={true} quality={100}/>
                </Link>

                <nav>
                    <Link href="/dashboard/newOrder">Novo Pedido</Link>
                    <Link href="/dashboard/category">Categoria</Link>
                    <Link href="/dashboard/product">Produtos</Link>

                    <form action={handleLogout}>
                        <button type='submit'> 
                            <LogOutIcon size={24} color='#fff'/> 
                        </button>
                    </form>
                </nav>
            </div>
        </header>
    )
}