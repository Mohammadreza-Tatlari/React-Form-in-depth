import { useForm, useFieldArray, FieldValue, FieldErrors } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import "../App.css";
import { useEffect } from "react";

type FormValue = {
  username: string;
  password: string;
  email: string;
  age: number;
  dateOfBirth: Date;
  phoneNumbers: string[];
  social: {
    facebook: string;
    twitter: string;
  };
  //useFieldArrays only works with objects thats why we use array of Objects
  phNumbers: {
    number: string;
  }[];
};
let counterofRender = 1;
export default function CheckoutForm() {

  const form = useForm<FormValue>({
    //adding default value act same as type FormValue in such way that FormValue can be removed from type useForm
    defaultValues: {
      username: "",
      email: "",
      password: "",
      age: 0,
      dateOfBirth: new Date(),
      phoneNumbers: ["", ""],
      social: {
        facebook: "",
        twitter: "",
      },
      phNumbers: [{ number: "" }],
    },

    //*by adding async function we can hold default data from a API data point
    // defaultValues: async () => {
    //   const response = await fetch('https://jsonplaceholder.typicode.com/users/1');
    //   const data = await response.json()
    //   return {
    //     username: '',
    //     email: data.email,
    //     password: ''
    //   }
    //}
  });
  //formstate added for displaying error to user
  const { register, control, handleSubmit, formState , watch , getValues , setValue} = form;
  //   const { name, ref, onChange, onBlur } = register("username");

  const { errors , touchedFields , dirtyFields , isDirty} = formState;

  //loging touched and dirty property of each value
  //console.log( touchedFields , dirtyFields , isDirty);
  
  //data being passed by handleSubmit
  const onSubmit = (data: FormValue) => {
    console.log("form is submitted", data);
  };

  const onError = (errors: FieldErrors<FormValue>) => {
    console.log("Errors are" , errors , "end of Form Error");
    
  }

  const { fields, append, remove } = useFieldArray({
    name: "phNumbers",
    control,
  });

  const primaryExists = getValues('phoneNumbers.0') === "";
  let setitTrue;
  if(primaryExists){
    setitTrue = true
  }

  //watch method is used for reusing or checking the form values
  //const watchedName = watch('username')
  //also whole value can be shown

//I am using useEffect to prevent re-render of whole page and improve performance
  //useEffect(() => {
    //const subscription = watch((value) => {
      //console.log(value);
    //})
    //return () => subscription.unsubscribe();
  //}, [watch]);

  //a function to retrieve values. and does not re-render data over manipulation
  function handleGetValue(){
    console.log("UserName and Age and twitter" , getValues(['username', 'age' , 'social.twitter'])); //it can show specific field values by putting them in an array
    console.log("all retrieved Data" , getValues())
  }

  function handleSetValue(){
    //the third argument is an optional object for field validation and other properties
    setValue('username', 'Real Name' , {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    })
    setValue('email' , '' , {
      shouldDirty: true,
      shouldValidate: false
    })
  }


//Main JSX and Return --------------------------------------------------------------------------------------------------------------------
  counterofRender++;
  return (
    <div>
      <h5>render time: {counterofRender}</h5>
      {/* <h3>your name is: {watchedName}</h3> */}
      {/* by using handleSubmit(onsubmit) onsubmit recieve full access over data */}
      {/* noValidate is added and the condition is sent to each register object */}
      <form onSubmit={handleSubmit(onSubmit , onError)} noValidate>
        <label htmlFor="username">UserName</label>
        {/* by assigning these values React Form tracks the value of input 
        but when istead we use spread operation and assign name to register hook*/}
        <input
          type="text"
          //  name={name}
          //   id="username"
          //   ref={ref}
          //   onChange={onChange}
          //   onBlur={onBlur}
          {...register("username", {
            required: "user name is required", //required validation
            validate: {
              //validation can be an object for multiple custom validation
              notAdmin: (fieldValue) => {
                return fieldValue !== "admin" || "select another user name";
              },
              blacklisted: (fieldValue) => {
                return (
                  !fieldValue.endsWith("baddomain") ||
                  "this domain name does not supported"
                );
              },
            },
          })}
        />
        <p>{errors.username?.message}</p>


        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          {...register("email", {
            required: "email is required", //required validation
            pattern: {
              //pattern validation
              value:
                // eslint-disable-next-line no-useless-escape
                /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
              message: "invalid Email format",
            },
            //custom validation for any differen value that user has been entered
            validate: (fieldValue) => {
              return (
                fieldValue !== "admin@example.com" ||
                "Enter Another Email Address"
              );
            },
          })}
        />
        <p>{errors.email?.message}</p>


        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          {...register("password", {
            required: {
              //required value can be written as an object
              value: true,
              message: "password is required",
            },
          })}
        />
        <p>{errors.password?.message}</p>


        <label htmlFor="age">Age</label>
        <input type="number" id="age" {...register('age',{
          //to deal with number with react form it should be defined
          valueAsNumber: true,
          required:{
            value: true,
            message: "Age is required"
          }
        })}/>
        <p>{errors.age?.message}</p>

        <label htmlFor="dob">Date of Birth</label>
        <input type="date" id="dob" {...register('dateOfBirth' ,{
          valueAsDate: true,
          required:{
            value: true,
            message: "date of birht is required"
          }
        })} />
        <p>{errors.dateOfBirth?.message}</p>

        <label htmlFor="twitter"> Twitter Account</label>
        <input type="text" id="twitter" {...register("social.twitter")} />
        <label htmlFor="facebook">FaceBook Account</label>
        <input type="text" id="facebook" {...register("social.facebook")} />
        <hr />


        <label htmlFor="primary-phoneNumber">Primary phone number</label>
        <input
          type="text"
          id="primary-phoneNumber"
          {...register("phoneNumbers.0", {
            required: {
              value: true,
              message: "Primary Phone Number is not valid",
            },
            validate: {
              shortNumber: (pnumber) => {
                return (
                  pnumber.length >= 4 ||
                  "primary number should be longer than 4 digits"
                );
              },
            },
          })}
        />
        <p>{errors.phoneNumbers?.[0]?.message}</p>
       

        <label htmlFor="secondary-phoneNumber">secondary phone number</label>
        <input
          type="text"
          id="secondary-phoneNumber"
          {...register("phoneNumbers.1", {
            disabled: setitTrue,
            required: {
              value: true,
              message: "secondary Phone Number is not valid",
            },
            validate: {
              shortNumber: (snumber) => {
                return (
                  snumber.length >= 4 ||
                  "number is shorter that what it needs to be"
                );
              },
            },
          })}
        />
        <p>{errors.phoneNumbers?.[1]?.message}</p>



        <div>
          <label>list of other phone numbers</label>
          <div>
            {fields.map((field, index) => (
              <div className="form-control" key={field.id}>
                <input
                  type="text"
                  {...register(`phNumbers.${index}.number` as const)}
                />
                {index > 0 && (
                  <button onClick={() => remove(index)}>Remove</button>
                )}
              </div>
            ))}
            <button onClick={() => append({ number: "" })}>Add</button>
          </div>
        </div>
        <hr />
        <button>{errors.email ? "دوباره" : "Submit"}</button>
        <button onClick={handleGetValue}>Log Data in Console</button>
        <hr/>
        <button onClick={handleSetValue}>Set Name and remove Email</button>
      </form>
      {/* associate the devtool with the form that is being tracked with control object 
      by seeing dirty and touch in react devtool everything can be sanity checked*/}
      <DevTool control={control} />

      <hr/>
      <h2>All data</h2>
      {/* <p>{JSON.stringify(watchWhole)}</p> */}
    </div>
  );
}



