<template>
    <div>
        <h2>Available Caretakers</h2>

        <table>
            <tr>
                <th>Caretaker</th>
                <th>Average Rating</th>
                <th>Availability</th>
            </tr>
            <tr v-bind:key="caretaker.id" v-for="caretaker in caretakers">
                <th>{{caretaker.username}}</th>
                <th>{{caretaker.rating}}</th>
                <th>{{caretaker.availability}}</th>
            </tr>
        </table>
    </div>
</template>

<script>
export default {
    name: "Browse Caretakers",
    data() {
        return {
            // TODO: add attributes 
        }
    },
    props: ["caretakers"],
    created() {
        const caretakers = [
            {
                username: "john",
                rating: "5",
                availability: "01/10/2020", // TODO: change
            },
        ];
        this.caretakers = caretakers;
    }
}
</script>

<style scoped>
    table {
    font-family: arial, sans-serif;
    border-collapse: collapse;
    width: 100%;
    }

    td, th {
    border: 1px solid #dddddd;
    text-align: left;
    padding: 8px;
    }

    tr:nth-child(even) {
    background-color: #dddddd;
    }
</style>