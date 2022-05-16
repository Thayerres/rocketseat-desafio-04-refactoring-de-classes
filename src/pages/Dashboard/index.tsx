import { useEffect, useState } from 'react';

import {Header} from '../../components/Header';
import api from '../../services/api';
import {Food} from '../../components/Food';
import {ModalAddFood} from '../../components/ModalAddFood';
import {ModalEditFood} from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

export interface IFood {
  id: number,
  name: string,
  description: string
  price: string,
  available: boolean,
  image: string
}

const INICIAL_STATE: IFood = {
  id: 0,
  name: "",
  description: "",
  price: "",
  available: false,
  image: ""
}
export function Dashboard(){
  const [foods,setFoods] = useState<IFood[]>([])
  const [editingFood,setEditingFood] = useState<IFood>(INICIAL_STATE)
  const [modalOpen,setModalOpen] = useState(false)
  const [editModalOpen,setEditModalOpen] = useState(false)

   useEffect(() => {
     const fetchData = async () => {
       const response = await api.get('/foods');
       setFoods(response.data)
     }

     fetchData()
  },[])

  const handleDelete = async (id:number) => {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setFoods(foodsFiltered);
  }

   const handleAddFood = async (food:IFood) => {
    try {
      const response = await api.post<IFood>('/foods', {
        ...food,
        available: true,
      });

      setFoods([...foods, response.data]);
    } catch (err) {
      console.log(err);
    }
  }

    const handleUpdateFood = async (food:IFood) => {
    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated)
    } catch (err) {
      console.log(err);
    }
  }

  const handleEditFood = (food:IFood) => {
    setEditingFood(food)
    setEditModalOpen(true)
  }

  return (
    <>
      <Header openModal={() => {setModalOpen(!modalOpen)}} />

      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={() => {setModalOpen(!modalOpen)}}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={() => {setEditModalOpen(!editModalOpen)}}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDelete}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  )
}