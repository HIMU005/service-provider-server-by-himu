import PropTypes from 'prop-types';
import TaskModal from '../Admin/TaskModal';
import { useState } from 'react';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import toast from 'react-hot-toast';

const ManageTaskRow = ({ task, idx, refetch }) => {
    const [isOpen, setIsOpen] = useState(false)
    const axiosSecure = useAxiosSecure();
    const modalOpen = () => {
        setIsOpen(true)
    }
    const closeModal = () => {
        setIsOpen(false)
    }
    const { taskName, taskNumber, amount, taskProvider, } = task;
    const handleDelete = async () => {
        try {
            const { data } = await axiosSecure.delete(`/task/${task._id}`)
            if (data.deletedCount) {
                toast.success('Task delete successfully');
                refetch();
            }
        } catch (err) {
            console.log(err);
            toast.error(err.message)
        }
    }
    return (
        <>
            <tr className='text-center'>
                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{idx}</td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">{taskName}</td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">{taskProvider.name}</td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">{taskNumber}</td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">{amount}</td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700"> {task > 0 ? 'Yes' : 'No'}</td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    <button
                        onClick={modalOpen}
                        className='btn btn-info btn-outline'>View</button>
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    <button
                        onClick={handleDelete}
                        className='btn btn-error btn-outline'>
                        Delete
                    </button>
                </td>
            </tr>
            <TaskModal
                task={task}
                isOpen={isOpen}
                closeModal={closeModal}
            />
        </>
    );
};

export default ManageTaskRow;
ManageTaskRow.propTypes = {
    task: PropTypes.object,
    idx: PropTypes.number,
    refetch: PropTypes.func,
}