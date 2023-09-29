import { NotFoundView } from '../sections/errors'

import DenseLayout from '@/layouts/dense'

export const metadata = {
    title: 'Page Not Found!',
}

export default function NotFoundPage() {
    return (
        <DenseLayout>
            <NotFoundView />
        </DenseLayout>
    )
}
