"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, ChevronDown, Filter, Search } from "lucide-react";
import { useMemo, useState } from "react";
import DoctorAppointmentCard from "./DoctorAppointmentCard";
import PatientProfileModal from "./PatientProfileModal";

type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "rejected"
  | "rescheduled"
  | "completed";

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string | null;
  profile_url: string | null;
  address: string | null;
  medical_conditions: string | null;
  emergency_contact: string | null;
  preferred_consultation_time: string | null;
}

interface DoctorAppointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  status: AppointmentStatus;
  note: string | null;
  created_at: string;
  updated_at: string;
  patient: Patient;
}

interface DoctorAppointmentsViewProps {
  appointments: DoctorAppointment[];
}

type DateFilter = "all" | "today" | "week" | "future" | "past";
type SortBy = "date_asc" | "date_desc" | "created" | "patient_name";

function DoctorAppointmentsView({ appointments }: DoctorAppointmentsViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "all">(
    "all"
  );
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [sortBy, setSortBy] = useState<SortBy>("date_asc");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const filterByDate = (appointment: DoctorAppointment): boolean => {
    const appointmentDate = new Date(appointment.appointment_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (dateFilter) {
      case "today":
        const todayEnd = new Date(today);
        todayEnd.setHours(23, 59, 59, 999);
        return appointmentDate >= today && appointmentDate <= todayEnd;
      case "week":
        const weekEnd = new Date(today);
        weekEnd.setDate(weekEnd.getDate() + 7);
        return appointmentDate >= today && appointmentDate <= weekEnd;
      case "future":
        return appointmentDate >= today;
      case "past":
        return appointmentDate < today;
      default:
        return true;
    }
  };

  const filteredAndSortedAppointments = useMemo(() => {
    const filtered = appointments.filter((appointment) => {
      // Search filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        searchTerm === "" ||
        appointment.patient.first_name.toLowerCase().includes(searchLower) ||
        appointment.patient.last_name.toLowerCase().includes(searchLower) ||
        appointment.patient.email.toLowerCase().includes(searchLower);

      // Status filter
      const matchesStatus =
        statusFilter === "all" || appointment.status === statusFilter;

      // Date filter
      const matchesDate = filterByDate(appointment);

      return matchesSearch && matchesStatus && matchesDate;
    });

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date_asc":
          return (
            new Date(a.appointment_date).getTime() -
            new Date(b.appointment_date).getTime()
          );
        case "date_desc":
          return (
            new Date(b.appointment_date).getTime() -
            new Date(a.appointment_date).getTime()
          );
        case "created":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        case "patient_name":
          return `${a.patient.first_name} ${a.patient.last_name}`.localeCompare(
            `${b.patient.first_name} ${b.patient.last_name}`
          );
        default:
          return 0;
      }
    });

    return filtered;
  }, [appointments, searchTerm, statusFilter, dateFilter, sortBy]);

  const statusCounts = useMemo(() => {
    return {
      all: appointments.length,
      pending: appointments.filter((a) => a.status === "pending").length,
      confirmed: appointments.filter((a) => a.status === "confirmed").length,
      completed: appointments.filter((a) => a.status === "completed").length,
      rejected: appointments.filter((a) => a.status === "rejected").length,
      rescheduled: appointments.filter((a) => a.status === "rescheduled")
        .length,
    };
  }, [appointments]);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Mes Rendez-vous</h1>
        <p className="text-muted-foreground dark:text-muted/80">
          Gérez vos rendez-vous avec vos patients
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
        <Button
          variant={statusFilter === "all" ? "default" : "outline"}
          onClick={() => setStatusFilter("all")}
          className="h-auto flex-col items-start p-4"
        >
          <div className="text-2xl font-bold">{statusCounts.all}</div>
          <div className="text-sm">Tous</div>
        </Button>
        <Button
          variant={statusFilter === "pending" ? "default" : "outline"}
          onClick={() => setStatusFilter("pending")}
          className="h-auto flex-col items-start p-4"
        >
          <div className="text-2xl font-bold">{statusCounts.pending}</div>
          <div className="text-sm">En attente</div>
        </Button>
        <Button
          variant={statusFilter === "confirmed" ? "default" : "outline"}
          onClick={() => setStatusFilter("confirmed")}
          className="h-auto flex-col items-start p-4"
        >
          <div className="text-2xl font-bold">{statusCounts.confirmed}</div>
          <div className="text-sm">Confirmés</div>
        </Button>
        <Button
          variant={statusFilter === "completed" ? "default" : "outline"}
          onClick={() => setStatusFilter("completed")}
          className="h-auto flex-col items-start p-4"
        >
          <div className="text-2xl font-bold">{statusCounts.completed}</div>
          <div className="text-sm">Terminés</div>
        </Button>
        <Button
          variant={statusFilter === "rescheduled" ? "default" : "outline"}
          onClick={() => setStatusFilter("rescheduled")}
          className="h-auto flex-col items-start p-4"
        >
          <div className="text-2xl font-bold">{statusCounts.rescheduled}</div>
          <div className="text-sm">Reprogrammés</div>
        </Button>
        <Button
          variant={statusFilter === "rejected" ? "default" : "outline"}
          onClick={() => setStatusFilter("rejected")}
          className="h-auto flex-col items-start p-4"
        >
          <div className="text-2xl font-bold">{statusCounts.rejected}</div>
          <div className="text-sm">Rejetés</div>
        </Button>
      </div>

      <Card className="p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="Rechercher par nom ou email du patient..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Button */}
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-5 h-5 mr-2" />
            Filtres
            <ChevronDown
              className={`w-4 h-4 ml-2 transition-transform ${
                showFilters ? "rotate-180" : ""
              }`}
            />
          </Button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Période</label>
              <Select
                value={dateFilter}
                onValueChange={(value) => setDateFilter(value as DateFilter)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les dates</SelectItem>
                  <SelectItem value="today">Aujourd&apos;hui</SelectItem>
                  <SelectItem value="week">Cette semaine</SelectItem>
                  <SelectItem value="future">À venir</SelectItem>
                  <SelectItem value="past">Passés</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Trier par
              </label>
              <Select
                value={sortBy}
                onValueChange={(value) => setSortBy(value as SortBy)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date_asc">Date (plus proche)</SelectItem>
                  <SelectItem value="date_desc">
                    Date (plus éloignée)
                  </SelectItem>
                  <SelectItem value="created">Date de création</SelectItem>
                  <SelectItem value="patient_name">Nom du patient</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </Card>

      <div className="mb-4 text-sm text-muted-foreground dark:text-muted/80">
        {filteredAndSortedAppointments.length} rendez-vous trouvé(s)
      </div>
      {filteredAndSortedAppointments.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {filteredAndSortedAppointments.map((appointment) => (
            <DoctorAppointmentCard
              key={appointment.id}
              appointment={appointment}
              onViewPatient={(patient) => setSelectedPatient(patient)}
            />
          ))}
        </div>
      ) : (
        <Card className="w-full p-12 text-center">
          <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Aucun rendez-vous trouvé
          </h3>
          <p className="text-muted-foreground">
            Essayez de modifier vos filtres ou votre recherche
          </p>
        </Card>
      )}

      {selectedPatient && (
        <PatientProfileModal
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
        />
      )}
    </div>
  );
}

export default DoctorAppointmentsView;
