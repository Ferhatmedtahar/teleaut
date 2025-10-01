"use client";

import {
  deleteAppointment,
  updateAppointment,
} from "@/actions/appointments/updateDeleteAppointment.action";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  Calendar,
  Edit,
  MoreVertical,
  Trash2,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "rejected"
  | "rescheduled"
  | "completed";

interface Doctor {
  first_name: string;
  last_name: string;
  specialization?: string;
}

interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  status: AppointmentStatus;
  note: string | null;
  created_at: string;
  updated_at: string;
  doctor: Doctor;
}

interface AppointmentsPatientCardProps {
  appointment: Appointment;
}

function AppointmentsPatientCard({
  appointment,
}: AppointmentsPatientCardProps) {
  const router = useRouter();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editNote, setEditNote] = useState(appointment.note || "");
  const [editDate, setEditDate] = useState(appointment.appointment_date);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getStatusColor = (status: AppointmentStatus): string => {
    const colors: Record<AppointmentStatus, string> = {
      pending:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      confirmed:
        "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      rejected: "bg-destructive/10 text-destructive",
      rescheduled: "bg-primary/10 text-primary",
      completed: "bg-muted text-muted-foreground",
    };
    return colors[status] || colors.pending;
  };

  const getStatusText = (status: AppointmentStatus): string => {
    const texts: Record<AppointmentStatus, string> = {
      pending: "En attente",
      confirmed: "Confirmé",
      rejected: "Rejeté",
      rescheduled: "Reprogrammé",
      completed: "Terminé",
    };
    return texts[status] || status;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleUpdateAppointment = async () => {
    setIsSubmitting(true);

    try {
      const result = await updateAppointment({
        id: appointment.id,
        note: editNote,
        appointment_date: editDate,
      });

      if (result.success) {
        toast.success(result.message || "Rendez-vous mis à jour avec succès");
        setShowEditModal(false);
        router.refresh();
      } else {
        toast.error(result.message || "Erreur lors de la mise à jour");
      }
    } catch (error) {
      toast.error("Une erreur est survenue");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAppointment = async () => {
    setIsSubmitting(true);

    try {
      const result = await deleteAppointment(appointment.id);

      if (result.success) {
        toast.success(result.message || "Rendez-vous supprimé avec succès");
        setShowDeleteModal(false);
        router.refresh();
      } else {
        toast.error(result.message || "Erreur lors de la suppression");
      }
    } catch (error) {
      toast.error("Une erreur est survenue");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full p-4">
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              {/* Doctor Info */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {appointment.doctor.first_name}{" "}
                    {appointment.doctor.last_name}
                  </h3>
                  {appointment.doctor.specialization && (
                    <p className="text-sm text-muted-foreground">
                      {appointment.doctor.specialization}
                    </p>
                  )}
                </div>
              </div>

              {/* Appointment Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-foreground">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm">
                    {formatDate(appointment.appointment_date)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={getStatusColor(appointment.status)}
                  >
                    {getStatusText(appointment.status)}
                  </Badge>
                </div>

                {appointment.note && (
                  <div className="flex items-start gap-2 text-foreground bg-muted p-3 rounded-md">
                    <AlertCircle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Note</p>
                      <p className="text-sm">{appointment.note}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="w-5 h-5" />
                  <span className="sr-only">Options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowEditModal(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Modifier
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setShowDeleteModal(true)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier le rendez-vous</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-date">Date du rendez-vous</Label>
              <Input
                id="edit-date"
                type="date"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
                min={
                  new Date(Date.now() + 86400000).toISOString().split("T")[0]
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-note">Note (optionnelle)</Label>
              <Textarea
                id="edit-note"
                value={editNote}
                onChange={(e) => setEditNote(e.target.value)}
                rows={4}
                placeholder="Raison de la visite ou notes supplémentaires..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowEditModal(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button onClick={handleUpdateAppointment} disabled={isSubmitting}>
              {isSubmitting ? "Mise à jour..." : "Mettre à jour"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-destructive" />
              </div>
              <DialogTitle>Supprimer le rendez-vous</DialogTitle>
            </div>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce rendez-vous avec{" "}
              {appointment.doctor.first_name} {appointment.doctor.last_name} ?
              Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAppointment}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Suppression..." : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AppointmentsPatientCard;

// "use client";

// import {
//   deleteAppointment,
//   updateAppointment,
// } from "@/actions/appointments/updateDeleteAppointment.action";
// import {
//   AlertCircle,
//   Calendar,
//   Edit,
//   MoreVertical,
//   Trash2,
//   User,
// } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { toast } from "sonner";

// type AppointmentStatus =
//   | "pending"
//   | "confirmed"
//   | "rejected"
//   | "rescheduled"
//   | "completed";

// interface Doctor {
//   first_name: string;
//   last_name: string;
//   specialization?: string;
// }

// interface Appointment {
//   id: string;
//   patient_id: string;
//   doctor_id: string;
//   appointment_date: string;
//   status: AppointmentStatus;
//   note: string | null;
//   created_at: string;
//   updated_at: string;
//   doctor: Doctor;
// }

// interface AppointmentsPatientCardProps {
//   appointment: Appointment;
// }

// function AppointmentsPatientCard({
//   appointment,
// }: AppointmentsPatientCardProps) {
//   const router = useRouter();
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [editNote, setEditNote] = useState(appointment.note || "");
//   const [editDate, setEditDate] = useState(appointment.appointment_date);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const getStatusColor = (status: AppointmentStatus): string => {
//     const colors: Record<AppointmentStatus, string> = {
//       pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
//       confirmed: "bg-green-100 text-green-800 border-green-300",
//       rejected: "bg-red-100 text-red-800 border-red-300",
//       rescheduled: "bg-blue-100 text-blue-800 border-blue-300",
//       completed: "bg-gray-100 text-gray-800 border-gray-300",
//     };
//     return colors[status] || colors.pending;
//   };

//   const getStatusText = (status: AppointmentStatus): string => {
//     const texts: Record<AppointmentStatus, string> = {
//       pending: "En attente",
//       confirmed: "Confirmé",
//       rejected: "Rejeté",
//       rescheduled: "Reprogrammé",
//       completed: "Terminé",
//     };
//     return texts[status] || status;
//   };

//   const formatDate = (dateString: string): string => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("fr-FR", {
//       weekday: "long",
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });
//   };

//   const handleEdit = () => {
//     setShowDropdown(false);
//     setShowEditModal(true);
//   };

//   const handleDelete = () => {
//     setShowDropdown(false);
//     setShowDeleteModal(true);
//   };

//   const handleUpdateAppointment = async () => {
//     setIsSubmitting(true);

//     try {
//       const result = await updateAppointment({
//         id: appointment.id,
//         note: editNote,
//         appointment_date: editDate,
//       });

//       if (result.success) {
//         toast.success(result.message || "Rendez-vous mis à jour avec succès");
//         setShowEditModal(false);
//         router.refresh();
//       } else {
//         toast.error(result.message || "Erreur lors de la mise à jour");
//       }
//     } catch (error) {
//       toast.error("Une erreur est survenue");
//       console.error(error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleDeleteAppointment = async () => {
//     setIsSubmitting(true);

//     try {
//       const result = await deleteAppointment(appointment.id);

//       if (result.success) {
//         toast.success(result.message || "Rendez-vous supprimé avec succès");
//         setShowDeleteModal(false);
//         router.refresh();
//       } else {
//         toast.error(result.message || "Erreur lors de la suppression");
//       }
//     } catch (error) {
//       toast.error("Une erreur est survenue");
//       console.error(error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="w-full p-4">
//       <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
//         <div className="flex justify-between items-start">
//           <div className="flex-1">
//             {/* Doctor Info */}
//             <div className="flex items-center gap-3 mb-4">
//               <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
//                 <User className="w-6 h-6 text-blue-600" />
//               </div>
//               <div>
//                 <h3 className="text-lg font-semibold text-gray-900">
//                   {appointment.doctor.first_name} {appointment.doctor.last_name}
//                 </h3>
//                 {appointment.doctor.specialization && (
//                   <p className="text-sm text-gray-500">
//                     {appointment.doctor.specialization}
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Appointment Details */}
//             <div className="space-y-3">
//               <div className="flex items-center gap-2 text-gray-700">
//                 <Calendar className="w-5 h-5 text-gray-400" />
//                 <span className="text-sm">
//                   {formatDate(appointment.appointment_date)}
//                 </span>
//               </div>

//               <div className="flex items-center gap-2">
//                 <span
//                   className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
//                     appointment.status
//                   )}`}
//                 >
//                   {getStatusText(appointment.status)}
//                 </span>
//               </div>

//               {appointment.note && (
//                 <div className="flex items-start gap-2 text-gray-700 bg-gray-50 p-3 rounded-md">
//                   <AlertCircle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
//                   <div>
//                     <p className="text-xs text-gray-500 mb-1">Note</p>
//                     <p className="text-sm">{appointment.note}</p>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Dropdown Menu */}
//           <div className="relative">
//             <button
//               onClick={() => setShowDropdown(!showDropdown)}
//               className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//               aria-label="Options"
//             >
//               <MoreVertical className="w-5 h-5 text-gray-600" />
//             </button>

//             {showDropdown && (
//               <>
//                 <div
//                   className="fixed inset-0 z-10"
//                   onClick={() => setShowDropdown(false)}
//                 />
//                 <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
//                   <button
//                     onClick={handleEdit}
//                     className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
//                   >
//                     <Edit className="w-4 h-4" />
//                     Modifier
//                   </button>
//                   <button
//                     onClick={handleDelete}
//                     className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
//                   >
//                     <Trash2 className="w-4 h-4" />
//                     Supprimer
//                   </button>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Edit Modal */}
//       {showEditModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg max-w-md w-full p-6">
//             <h2 className="text-xl font-semibold mb-4">
//               Modifier le rendez-vous
//             </h2>

//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Date du rendez-vous
//                 </label>
//                 <input
//                   type="date"
//                   value={editDate}
//                   onChange={(e) => setEditDate(e.target.value)}
//                   min={
//                     new Date(Date.now() + 86400000).toISOString().split("T")[0]
//                   }
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Note (optionnelle)
//                 </label>
//                 <textarea
//                   value={editNote}
//                   onChange={(e) => setEditNote(e.target.value)}
//                   rows={4}
//                   placeholder="Raison de la visite ou notes supplémentaires..."
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//             </div>

//             <div className="flex gap-3 mt-6">
//               <button
//                 onClick={() => setShowEditModal(false)}
//                 disabled={isSubmitting}
//                 className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50"
//               >
//                 Annuler
//               </button>
//               <button
//                 onClick={handleUpdateAppointment}
//                 disabled={isSubmitting}
//                 className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
//               >
//                 {isSubmitting ? "Mise à jour..." : "Mettre à jour"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Delete Modal */}
//       {showDeleteModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg max-w-md w-full p-6">
//             <div className="flex items-center gap-3 mb-4">
//               <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
//                 <Trash2 className="w-6 h-6 text-red-600" />
//               </div>
//               <h2 className="text-xl font-semibold">
//                 Supprimer le rendez-vous
//               </h2>
//             </div>

//             <p className="text-gray-600 mb-6">
//               Êtes-vous sûr de vouloir supprimer ce rendez-vous avec{" "}
//               {appointment.doctor.first_name} {appointment.doctor.last_name} ?
//               Cette action est irréversible.
//             </p>

//             <div className="flex gap-3">
//               <button
//                 onClick={() => setShowDeleteModal(false)}
//                 disabled={isSubmitting}
//                 className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50"
//               >
//                 Annuler
//               </button>
//               <button
//                 onClick={handleDeleteAppointment}
//                 disabled={isSubmitting}
//                 className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
//               >
//                 {isSubmitting ? "Suppression..." : "Supprimer"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default AppointmentsPatientCard;
// // // import React from "react";

// // // function AppointmentsPatientCard() {
// // //   return <div>AppointmentsPatientCard</div>;
// // // }

// // // export default AppointmentsPatientCard;

// // "use client";

// // import React, { useState } from "react";
// // import {
// //   MoreVertical,
// //   Calendar,
// //   Clock,
// //   User,
// //   AlertCircle,
// //   Trash2,
// //   Edit,
// // } from "lucide-react";

// // function AppointmentsPatientCard({ appointment }: { appointment: any }) {
// //   const [showDropdown, setShowDropdown] = useState(false);
// //   const [showEditModal, setShowEditModal] = useState(false);
// //   const [showDeleteModal, setShowDeleteModal] = useState(false);
// //   const [editNote, setEditNote] = useState(appointment.note);
// //   const [editDate, setEditDate] = useState(appointment.appointment_date);
// //   const [isSubmitting, setIsSubmitting] = useState(false);

// //   const getStatusColor = (status) => {
// //     const colors = {
// //       pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
// //       confirmed: "bg-green-100 text-green-800 border-green-300",
// //       rejected: "bg-red-100 text-red-800 border-red-300",
// //       rescheduled: "bg-blue-100 text-blue-800 border-blue-300",
// //       completed: "bg-gray-100 text-gray-800 border-gray-300",
// //     };
// //     return colors[status] || colors.pending;
// //   };

// //   const getStatusText = (status) => {
// //     const texts = {
// //       pending: "En attente",
// //       confirmed: "Confirmé",
// //       rejected: "Rejeté",
// //       rescheduled: "Reprogrammé",
// //       completed: "Terminé",
// //     };
// //     return texts[status] || status;
// //   };

// //   const formatDate = (dateString) => {
// //     const date = new Date(dateString);
// //     return date.toLocaleDateString("fr-FR", {
// //       weekday: "long",
// //       year: "numeric",
// //       month: "long",
// //       day: "numeric",
// //     });
// //   };

// //   const handleEdit = () => {
// //     setShowDropdown(false);
// //     setShowEditModal(true);
// //   };

// //   const handleDelete = () => {
// //     setShowDropdown(false);
// //     setShowDeleteModal(true);
// //   };

// //   const handleUpdateAppointment = async () => {
// //     setIsSubmitting(true);
// //     // TODO: Call your update action here
// //     // await updateAppointment(mockAppointment.id, { note: editNote, appointment_date: editDate });

// //     setTimeout(() => {
// //       setIsSubmitting(false);
// //       setShowEditModal(false);
// //       // Show success message or refresh data
// //     }, 1000);
// //   };

// //   const handleDeleteAppointment = async () => {
// //     setIsSubmitting(true);
// //     // TODO: Call your delete action here
// //     // await deleteAppointment(mockAppointment.id);

// //     setTimeout(() => {
// //       setIsSubmitting(false);
// //       setShowDeleteModal(false);
// //       // Show success message or refresh data
// //     }, 1000);
// //   };

// //   return (
// //     <div className="max-w-4xl mx-auto p-4">
// //       <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
// //         <div className="flex justify-between items-start">
// //           <div className="flex-1">
// //             {/* Doctor Info */}
// //             <div className="flex items-center gap-3 mb-4">
// //               <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
// //                 <User className="w-6 h-6 text-blue-600" />
// //               </div>
// //               <div>
// //                 <h3 className="text-lg font-semibold text-gray-900">
// //                   {appointment.doctor.first_name} {appointment.doctor.last_name}
// //                 </h3>
// //                 <p className="text-sm text-gray-500">
// //                   {appointment.doctor.specialization}
// //                 </p>
// //               </div>
// //             </div>

// //             {/* Appointment Details */}
// //             <div className="space-y-3">
// //               <div className="flex items-center gap-2 text-gray-700">
// //                 <Calendar className="w-5 h-5 text-gray-400" />
// //                 <span className="text-sm">
// //                   {formatDate(appointment.appointment_date)}
// //                 </span>
// //               </div>

// //               <div className="flex items-center gap-2">
// //                 <span
// //                   className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
// //                     appointment.status
// //                   )}`}
// //                 >
// //                   {getStatusText(appointment.status)}
// //                 </span>
// //               </div>

// //               {appointment.note && (
// //                 <div className="flex items-start gap-2 text-gray-700 bg-gray-50 p-3 rounded-md">
// //                   <AlertCircle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
// //                   <div>
// //                     <p className="text-xs text-gray-500 mb-1">Note</p>
// //                     <p className="text-sm">{appointment.note}</p>
// //                   </div>
// //                 </div>
// //               )}
// //             </div>
// //           </div>

// //           {/* Dropdown Menu */}
// //           <div className="relative">
// //             <button
// //               onClick={() => setShowDropdown(!showDropdown)}
// //               className="p-2 hover:bg-gray-100 rounded-full transition-colors"
// //             >
// //               <MoreVertical className="w-5 h-5 text-gray-600" />
// //             </button>

// //             {showDropdown && (
// //               <>
// //                 <div
// //                   className="fixed inset-0 z-10"
// //                   onClick={() => setShowDropdown(false)}
// //                 />
// //                 <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
// //                   <button
// //                     onClick={handleEdit}
// //                     className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
// //                   >
// //                     <Edit className="w-4 h-4" />
// //                     Modifier
// //                   </button>
// //                   <button
// //                     onClick={handleDelete}
// //                     className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
// //                   >
// //                     <Trash2 className="w-4 h-4" />
// //                     Supprimer
// //                   </button>
// //                 </div>
// //               </>
// //             )}
// //           </div>
// //         </div>
// //       </div>

// //       {/* Edit Modal */}
// //       {showEditModal && (
// //         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
// //           <div className="bg-white rounded-lg max-w-md w-full p-6">
// //             <h2 className="text-xl font-semibold mb-4">
// //               Modifier le rendez-vous
// //             </h2>

// //             <div className="space-y-4">
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// //                   Date du rendez-vous
// //                 </label>
// //                 <input
// //                   type="date"
// //                   value={editDate}
// //                   onChange={(e) => setEditDate(e.target.value)}
// //                   min={
// //                     new Date(Date.now() + 86400000).toISOString().split("T")[0]
// //                   }
// //                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                 />
// //               </div>

// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// //                   Note (optionnelle)
// //                 </label>
// //                 <textarea
// //                   value={editNote}
// //                   onChange={(e) => setEditNote(e.target.value)}
// //                   rows={4}
// //                   placeholder="Raison de la visite ou notes supplémentaires..."
// //                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                 />
// //               </div>
// //             </div>

// //             <div className="flex gap-3 mt-6">
// //               <button
// //                 onClick={() => setShowEditModal(false)}
// //                 disabled={isSubmitting}
// //                 className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50"
// //               >
// //                 Annuler
// //               </button>
// //               <button
// //                 onClick={handleUpdateAppointment}
// //                 disabled={isSubmitting}
// //                 className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
// //               >
// //                 {isSubmitting ? "Mise à jour..." : "Mettre à jour"}
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* Delete Modal */}
// //       {showDeleteModal && (
// //         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
// //           <div className="bg-white rounded-lg max-w-md w-full p-6">
// //             <div className="flex items-center gap-3 mb-4">
// //               <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
// //                 <Trash2 className="w-6 h-6 text-red-600" />
// //               </div>
// //               <h2 className="text-xl font-semibold">
// //                 Supprimer le rendez-vous
// //               </h2>
// //             </div>

// //             <p className="text-gray-600 mb-6">
// //               Êtes-vous sûr de vouloir supprimer ce rendez-vous avec{" "}
// //               {appointment.doctor.first_name} {appointment.doctor.last_name} ?
// //               Cette action est irréversible.
// //             </p>

// //             <div className="flex gap-3">
// //               <button
// //                 onClick={() => setShowDeleteModal(false)}
// //                 disabled={isSubmitting}
// //                 className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50"
// //               >
// //                 Annuler
// //               </button>
// //               <button
// //                 onClick={handleDeleteAppointment}
// //                 disabled={isSubmitting}
// //                 className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
// //               >
// //                 {isSubmitting ? "Suppression..." : "Supprimer"}
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // export default AppointmentsPatientCard;
