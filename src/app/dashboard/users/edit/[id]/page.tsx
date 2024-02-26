import { getUser, updateUserRole } from "@/actions/user";
import { UserRole } from "@/types/user";
import { auth } from "@/utils/auth";
import { Sheet, Typography } from "@mui/joy";
import { redirect } from "next/navigation";
import Form from "./components/form";

export default async function Page({ params }: {
    params: { id: number }
}) {
    const user = await getUser(params.id);

    return (
        <>
            <Typography level="h1">
                Edit User
            </Typography>
            <Sheet variant="outlined" sx={{
                borderRadius: 'sm',
                padding: "2rem"

            }}>
                {user && <Form user={user} action={handleUserUpdateForm} />}
            </Sheet>
        </>
    )
}

async function handleUserUpdateForm(formData: FormData) {
    "use server"
    const session = await auth()
    if (session?.user.role === "admin") {
        const data = Object.fromEntries(formData.entries());
        await updateUserRole(Number(data.id), data.role as UserRole)
        redirect("/dashboard/users")
    }
}
