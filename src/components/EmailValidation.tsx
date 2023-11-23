import {Controller, useForm } from 'react-hook-form'
import { DevTool } from '@hookform/devtools';

type formValue = {
    email: string
}
export default function EmailVerify() {


    const form = useForm<formValue>({
        defaultValues: {
            email: ''
        },
        mode:"onTouched"
    })

    const {register , control , formState , handleSubmit} = form
    const { errors } = formState
    
    function onSubmit(data: formValue) {
        console.log("email is:",data);
        
    }

  return (
    <>
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="email">check your email</label>
      <input placeholder='example@gmail.com' type="text" id="email" {...register('email' ,{
        required:{
            value: true,
            message: "insert an email to be verified"
        },
        pattern:{
            value: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
            message: "invalid type of Email"
        },
        validate:{
            emailValidation: async (fieldValue) => {
                const response = await fetch(`https://jsonplaceholder.typicode.com/users?email=${fieldValue}`);
                const data = await response.json()
                console.log(data);
                if(data.length > 0 ){
                    return "email exists in data base"
                }else{
                    return "email Doesn't Exist"
                }
            }
        }
      })} />
      <p>{errors.email?.message}</p>
      <button type="submit">Submit</button>
      </form>
      <DevTool control={control}/>
    </>
  );
}
