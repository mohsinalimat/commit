import { SmallCircularSpinner } from "@/components/common/loader/SmallCicularSpinner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { useFrappePostCall } from "frappe-react-sdk"
import { useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"

interface UserAuthFormFields {
    full_name: string
    email: string
}

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string
}

export const UserAuthForm = ({ className, ...props }: UserAuthFormProps) => {

    const methods = useForm<UserAuthFormFields>()

    const { call, loading } = useFrappePostCall('frappe.core.doctype.user.user.sign_up')

    const { toast } = useToast()

    const onSubmit = (data: UserAuthFormFields) => {
        call({
            full_name: data.full_name,
            email: data.email,
            redirect_to: ''
        }).then((res) => {
            return res.message
        }).then((res) => {
            if (res[0] === 1) {
                toast({
                    title: 'Success',
                    description: 'Please check your email for verification link',
                })
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    useEffect(() => {
        methods.reset()
    }, [])

    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)}>
                    <div className="grid gap-2">
                        <div className="grid gap-1">
                            <Label className="sr-only" htmlFor="full_name">
                                Full Name
                            </Label>
                            <Input
                                {...methods.register("full_name", { required: { value: true, message: "Full Name is required" } })}
                                id="full_name"
                                placeholder="John Doe"
                                type="text"
                                autoCapitalize="none"
                                autoComplete="name"
                                autoCorrect="off"
                                disabled={loading}
                            />
                        </div>
                        <div className="grid gap-1">
                            <Label className="sr-only" htmlFor="email">
                                Email
                            </Label>
                            <Input
                                {...methods.register("email", { required: { value: true, message: "Email is required" } })}
                                required
                                id="email"
                                placeholder="name@example.com"
                                type="email"
                                autoCapitalize="none"
                                autoComplete="email"
                                autoCorrect="off"
                                disabled={loading}
                            />
                        </div>
                        <Button disabled={loading} type="submit" className="mt-1">
                            {loading && (
                                <SmallCircularSpinner className="pr-2" />
                            )}
                            Sign Up with Email
                        </Button>
                    </div>
                </form>
            </FormProvider>
        </div>
    )
}