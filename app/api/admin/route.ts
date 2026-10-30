import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request){
    const session = await getServerSession(authOptions);
    if (!session){
        return NextResponse.json({
           message: "Akses ditolak"},
           { status: 401}
            
        )
    }
    const body = await request.json();
    const {name, email, password} = body;

    if (!name||!email||!password){
        return NextResponse.json(
            {message: "Semua data harus diisi"},
        {status:400})
    }
    const existingUser = await prisma.user.findUnique({
        where:{
            email:email
        } 
    })
    if (existingUser) {
    return NextResponse.json(
        { message: "Email sudah terdaftar" },
        { status: 409 }
    );
}
const hashedPassword = await bcrypt.hash(password, 10);
const newUser = await prisma.user.create({
    data:{
        name: name,
        email: email,
        password: hashedPassword,
    }
})
return NextResponse.json(
    {message: "Akun baru telah ditambahkan"},
    {status: 201} 
)
} 
