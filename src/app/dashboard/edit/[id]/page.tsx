import { Metadata } from 'next';
import EditForm from './EditForm';

export const metadata: Metadata = {
  title: 'Edit Person',
  description: 'Edit person details',
};

export default function EditPage({ params }: { params: { id: string } }) {
  return <EditForm id={params.id} />;
}
