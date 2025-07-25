"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Reservation } from '@/types/admin';
import { Calendar, Clock, Users, Phone, Mail } from 'lucide-react';

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await fetch('/api/admin/reservations');
      const data = await response.json();
      setReservations(data);
    } catch (error) {
      console.error('Erreur lors du chargement des réservations:', error);
      // Données mockées en cas d'erreur
      setReservations([
        {
          id: 'RES001',
          customerName: 'Marie Dubois',
          customerEmail: 'marie.dubois@email.com',
          customerPhone: '+33 6 12 34 56 78',
          reservationDate: '2024-07-24',
          reservationTime: '19:30',
          partySize: 4,
          specialRequests: 'Table près de la fenêtre',
          status: 'confirmed',
          tableNumber: 'T12',
          createdAt: '2024-07-23T10:30:00Z',
          updatedAt: '2024-07-23T10:30:00Z'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const updateReservationStatus = async (id: string, status: Reservation['status']) => {
    try {
      await fetch(`/api/admin/reservations/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      setReservations(prev =>
        prev.map(res => res.id === id ? { ...res, status } : res)
      );
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  const getStatusColor = (status: Reservation['status']) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'seated': return 'bg-blue-500';
      case 'completed': return 'bg-gray-500';
      case 'cancelled': return 'bg-red-500';
      case 'no_show': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Réservations</h1>
        <Button>Nouvelle réservation</Button>
      </div>

      <div className="grid gap-4">
        {reservations.map((reservation) => (
          <Card key={reservation.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {reservation.customerName}
                </CardTitle>
                <Badge className={getStatusColor(reservation.status)}>
                  {reservation.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>{reservation.reservationDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>{reservation.reservationTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span>{reservation.partySize} personnes</span>
                </div>
                {reservation.tableNumber && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Table {reservation.tableNumber}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{reservation.customerEmail}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{reservation.customerPhone}</span>
                </div>
              </div>

              {reservation.specialRequests && (
                <div>
                  <h4 className="font-medium mb-1">Demandes spéciales :</h4>
                  <p className="text-gray-600">{reservation.specialRequests}</p>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                {reservation.status === 'pending' && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => updateReservationStatus(reservation.id, 'confirmed')}
                    >
                      Confirmer
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => updateReservationStatus(reservation.id, 'cancelled')}
                    >
                      Annuler
                    </Button>
                  </>
                )}
                {reservation.status === 'confirmed' && (
                  <Button
                    size="sm"
                    onClick={() => updateReservationStatus(reservation.id, 'seated')}
                  >
                    Installer
                  </Button>
                )}
                {reservation.status === 'seated' && (
                  <Button
                    size="sm"
                    onClick={() => updateReservationStatus(reservation.id, 'completed')}
                  >
                    Terminer
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
