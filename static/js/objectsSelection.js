var selectedObject = {
    object_id: null,
    object_type: null,
    object_element: null,
    axial_coordinates: null,
};

// Function to deselect the selected object
function deselectSelectedObject()
{
    if (selectedObject.object_type == 'soldier')
    {
        deselectSoldier(selectedObject.object_element)
    }

    // Clear the selected object
    selectedObject.object_id = null;
    selectedObject.object_type = null;
    selectedObject.object_element = null;
    selectedObject.axial_coordinates = null;

}