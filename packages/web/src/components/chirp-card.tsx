import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ChirpModel } from '@/common/models/chirp.model';
import { FC } from 'react';
import { Button } from '@/components/ui/button';

interface ChirpCardProps {
  chirp: ChirpModel;
  deleteChirp: any;
  userId?: number;
}

export const ChirpCard: FC<ChirpCardProps> = ({ chirp, deleteChirp, userId }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center gap-2">
          <h2 className="font-semibold">{chirp.title}</h2>
          <span className="text-sm text-gray-500">{chirp?.user?.username}</span>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex justify-between items-center">
        <div>{chirp.content}</div>
        {chirp.user_id === userId && (
          <Button variant="destructive" size="sm" onClick={() => deleteChirp(chirp.id)}>
            Delete
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
