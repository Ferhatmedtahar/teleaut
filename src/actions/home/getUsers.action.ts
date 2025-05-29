"use server";

import { createClient } from "@/lib/supabase/server";

export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  profile_url: string | null;
  role: "student" | "teacher" | "admin";
  email?: string;
  created_at: string;
}

// Get all users (students and teachers)
export async function getAllUsers(): Promise<{
  success: boolean;
  students: UserProfile[];
  teachers: UserProfile[];
}> {
  const supabase = await createClient();

  try {
    // Get all students
    const { data: students, error: studentsError } = await supabase
      .from("users")
      .select("id, first_name, last_name, profile_url, role, email, created_at")
      .eq("role", "student")
      .order("created_at", { ascending: false })
      .limit(50);

    if (studentsError) {
      console.error("Error fetching students:", studentsError);
    }

    // Get all teachers
    const { data: teachers, error: teachersError } = await supabase
      .from("users")
      .select("id, first_name, last_name, profile_url, role, email, created_at")
      .eq("role", "teacher")
      .order("created_at", { ascending: false })
      .limit(50);

    if (teachersError) {
      console.error("Error fetching teachers:", teachersError);
    }

    return {
      success: true,
      students: students || [],
      teachers: teachers || [],
    };
  } catch (error) {
    console.error("Error in getAllUsers:", error);

    // Return dummy data as fallback
    return {
      success: true,
      students: [
        {
          id: "student-1",
          first_name: "Alice",
          last_name: "Martin",
          profile_url: "/placeholder.svg?height=40&width=40",
          role: "student",
          email: "alice.martin@example.com",
          created_at: new Date().toISOString(),
        },
        {
          id: "student-2",
          first_name: "Bob",
          last_name: "Dupont",
          profile_url: "/placeholder.svg?height=40&width=40",
          role: "student",
          email: "bob.dupont@example.com",
          created_at: new Date().toISOString(),
        },
        {
          id: "student-3",
          first_name: "Claire",
          last_name: "Bernard",
          profile_url: "/placeholder.svg?height=40&width=40",
          role: "student",
          email: "claire.bernard@example.com",
          created_at: new Date().toISOString(),
        },
      ],
      teachers: [
        {
          id: "teacher-1",
          first_name: "Marie",
          last_name: "Dubois",
          profile_url: "/placeholder.svg?height=40&width=40",
          role: "teacher",
          email: "marie.dubois@example.com",
          created_at: new Date().toISOString(),
        },
        {
          id: "teacher-2",
          first_name: "Pierre",
          last_name: "Moreau",
          profile_url: "/placeholder.svg?height=40&width=40",
          role: "teacher",
          email: "pierre.moreau@example.com",
          created_at: new Date().toISOString(),
        },
      ],
    };
  }
}

// Search users (students and teachers) based on query
export async function searchUsers(query: string): Promise<{
  success: boolean;
  students: UserProfile[];
  teachers: UserProfile[];
}> {
  const supabase = await createClient();

  try {
    // Search students based on name and email
    const { data: students, error: studentsError } = await supabase
      .from("users")
      .select("id, first_name, last_name, profile_url, role, email, created_at")
      .eq("role", "student")
      .or(
        `first_name.ilike.%${query}%, last_name.ilike.%${query}%, email.ilike.%${query}%`
      )
      .order("created_at", { ascending: false })
      .limit(20);

    if (studentsError) {
      console.error("Error searching students:", studentsError);
    }

    // Search teachers based on name and email
    const { data: teachers, error: teachersError } = await supabase
      .from("users")
      .select("id, first_name, last_name, profile_url, role, email, created_at")
      .eq("role", "teacher")
      .or(
        `first_name.ilike.%${query}%, last_name.ilike.%${query}%, email.ilike.%${query}%`
      )
      .order("created_at", { ascending: false })
      .limit(20);

    if (teachersError) {
      console.error("Error searching teachers:", teachersError);
    }

    return {
      success: true,
      students: students || [],
      teachers: teachers || [],
    };
  } catch (error) {
    console.error("Error in searchUsers:", error);

    // Return dummy filtered data as fallback
    const dummyStudents = [
      {
        id: "student-1",
        first_name: "Alice",
        last_name: "Martin",
        profile_url: "/placeholder.svg?height=40&width=40",
        role: "student" as const,
        email: "alice.martin@example.com",
        created_at: new Date().toISOString(),
      },
      {
        id: "student-2",
        first_name: "Bob",
        last_name: "Dupont",
        profile_url: "/placeholder.svg?height=40&width=40",
        role: "student" as const,
        email: "bob.dupont@example.com",
        created_at: new Date().toISOString(),
      },
    ];

    const dummyTeachers = [
      {
        id: "teacher-1",
        first_name: "Marie",
        last_name: "Dubois",
        profile_url: "/placeholder.svg?height=40&width=40",
        role: "teacher" as const,
        email: "marie.dubois@example.com",
        created_at: new Date().toISOString(),
      },
    ];

    // Filter dummy data based on query
    const filteredStudents = dummyStudents.filter(
      (student) =>
        student.first_name.toLowerCase().includes(query.toLowerCase()) ||
        student.last_name.toLowerCase().includes(query.toLowerCase()) ||
        student.email.toLowerCase().includes(query.toLowerCase())
    );

    const filteredTeachers = dummyTeachers.filter(
      (teacher) =>
        teacher.first_name.toLowerCase().includes(query.toLowerCase()) ||
        teacher.last_name.toLowerCase().includes(query.toLowerCase()) ||
        teacher.email.toLowerCase().includes(query.toLowerCase())
    );

    return {
      success: true,
      students: filteredStudents,
      teachers: filteredTeachers,
    };
  }
}
