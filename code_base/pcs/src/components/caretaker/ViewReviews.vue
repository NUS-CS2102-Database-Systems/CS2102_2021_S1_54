<template>
    <div>
        <h2>View My Reviews</h2>

        <table>
            <tr>
                <th>Reviewer</th>
                <th>Review</th>
                <th>Rating</th>
                <th>Written At</th>
            </tr>
            <tr v-bind:key="review.id" v-for="review in reviews">
                <th>{{review.pet_owner_username}}</th>
                <th>{{review.review}}</th>
                <th>{{review.rating}}</th>
                <th>{{review.datetime}}</th>
            </tr>
        </table>
    </div>
</template>

<script>
export default {
    name: "ViewReviews",
    data() {
        return {
            caretaker_username: ""
        }
    },
    props: ["reviews"],
    created() {
        const reviews = [
            {
                pet_owner_username: "john",
                review: "great!",
                rating: "5",
                datetime: "01/10/2020"
            },
            {
                pet_owner_username: "may",
                review: "great!",
                rating: "4",
                datetime: "01/09/2020"
            },
            {
                pet_owner_username: "cindy",
                review: "great!",
                rating: "3",
                datetime: "01/08/2020"
            }
        ];
        this.reviews = reviews;
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