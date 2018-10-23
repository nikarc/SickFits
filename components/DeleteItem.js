import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import { ALL_ITEMS_QUERY } from "./Items";

const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`;

class DeleteItem extends Component {
  update = (cache, payload) => {
    // Manually update cache on client to match server
    // Read cache
    const data = cache.readQuery({ query: ALL_ITEMS_QUERY });
    console.log("data: ", data);
    // Filter delete item from query items
    data.items = data.items.filter(
      item => item.id !== payload.data.deleteItem.id
    );
    // Put items back in cache
    cache.writeQuery({
      query: ALL_ITEMS_QUERY,
      data,
    });
  };

  render() {
    const { children, id } = this.props;
    return (
      <Mutation
        mutation={DELETE_ITEM_MUTATION}
        variables={{ id }}
        update={this.update}
      >
        {(deleteItem, { error }) => (
          <button
            type="button"
            onClick={() => {
              if (confirm("Are you sure you want to delete this item?")) {
                deleteItem();
              }
            }}
          >
            {children}
          </button>
        )}
      </Mutation>
    );
  }
}

export default DeleteItem;
