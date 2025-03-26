"use client"

import styles from './styles.module.scss'
import { useFormStatus } from 'react-dom';

interface NameProps {
    name: string;
}

export function Button({name}: NameProps){

  const { pending } = useFormStatus()

    return(
      <button type='submit' disabled={pending} className={styles.button}>
        {
          pending ? "Cadastrando..." : name
        }
      </button>  
    )
}