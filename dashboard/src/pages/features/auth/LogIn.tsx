import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export const LogIn = () => {

    return (
        <div
            className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-50"
        // style={{
        //     backgroundImage: "url(https://img.freepik.com/premium-vector/programming-developers-vector-seamless-pattern-internet-coding_341076-444.jpg?w=1380)",
        // }}
        >
            <div className="flex flex-col items-center justify-center w-full px-4 sm:max-w-2xl sm:px-6 lg:max-w-3xl lg:px-8">
                <div className="flex flex-col items-center justify-center w-full">
                    <div className="w-full max-w-[400px] bg-white rounded-lg shadow-lg p-6">
                        <div className="relative z-20 flex items-center justify-center my-6 text-4xl font-medium font-semibold">
                            commit<span className="text-green-500">.</span>
                        </div>
                        <div className="space-y-2 text-center">
                            <h2 className="pt-5 text-2xl font-semibold text-center text-gray-900 tracking-tight">
                                Sign in to your account
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Enter your email below to Log in
                            </p>
                        </div>
                        <div className="mt-8">
                            <div className="mt-6">
                                <form className="space-y-6" action="#" method="POST">
                                    <div>
                                        <Label htmlFor="email" className="sr-only">
                                            Email address
                                        </Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            placeholder="name@example.com"
                                        />
                                    </div>

                                    <div>
                                        <Button className="w-full">
                                            Sign in with Email
                                        </Button>
                                    </div>

                                    <div className="text-xs text-center">
                                        <a href="#" className="font-medium text-gray-400 hover:text-blue-800">
                                            Forgot your password?
                                        </a>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}