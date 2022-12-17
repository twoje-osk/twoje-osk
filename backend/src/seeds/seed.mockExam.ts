import {
  mockExamQuestionTypesFactory,
  ParsedTypesData,
} from './mockExam/seed.mockExamQuestionType';
import {
  mockExamQuestionAnswerFactory,
  ParsedAnswersData,
} from './mockExam/seed.mockExamQuestionAnswer';
import {
  mockExamQuestionFactory,
  ParsedQuestionsData,
} from './mockExam/seed.mockExamQuestion';
import { ParsedQuestionCategoriesDriversLicenseCategoryData } from './mockExam/seed.mockExamQuestionCategoriesDriversLicenseCategory';
import { driversLicenseCategoriesFactory } from './seed.driversLicenseCategories';
import { fetchAndParse } from './mockExam/seed.mockExam.utils';

interface SeedMockExamArguments {
  useProductionData: boolean;
}
export const seedMockExam = async ({
  useProductionData,
}: SeedMockExamArguments) => {
  const parsedQuestionsPromise = fetchAndParse<ParsedQuestionsData>(
    'mockExamQuestion.csv',
    useProductionData,
  );
  const parsedAnswersPromise = fetchAndParse<ParsedAnswersData>(
    'mockExamQuestionAnswer.csv',
    useProductionData,
  );
  const parsedTypesPromise = fetchAndParse<ParsedTypesData>(
    'mockExamQuestionType.csv',
    useProductionData,
  );
  const parsedQuestionCategoriesDriversLicenseCategoryPromise =
    fetchAndParse<ParsedQuestionCategoriesDriversLicenseCategoryData>(
      'mockExamQuestionCategoriesDriversLicenseCategory.csv',
      useProductionData,
    );

  const [
    parsedQuestions,
    parsedAnswers,
    parsedTypes,
    parsedQuestionCategoriesDriversLicenseCategory,
  ] = await Promise.all([
    parsedQuestionsPromise,
    parsedAnswersPromise,
    parsedTypesPromise,
    parsedQuestionCategoriesDriversLicenseCategoryPromise,
  ]);

  const questionIdToIndex: Record<number, number> = Object.fromEntries(
    parsedQuestions.map(({ id }, i) => [id, i]),
  );

  const answerIdToIndex: Record<number, number> = Object.fromEntries(
    parsedAnswers.map(({ answerId }, i) => [answerId, i]),
  );

  const typesIdToIndex: Record<number, number> = Object.fromEntries(
    parsedTypes.map(({ questionTypeId }, i) => [questionTypeId, i]),
  );

  const types = parsedTypes.map((type) =>
    mockExamQuestionTypesFactory.generateFromData({
      scope: type.scope,
      timeToAnswer: type.timeToAnswer,
      timeToReadTheQuestion: type.timeToReadTheQuestion,
    }),
  );

  const answers = parsedAnswers.map(({ answerContent }) =>
    mockExamQuestionAnswerFactory.generateFromData({
      answerContent,
    }),
  );

  const questions = parsedQuestions.map(
    ({ correctAnswerId, mediaReference, points, question, typeId }) => {
      return mockExamQuestionFactory.generateFromData({
        mediaReference,
        points,
        question,
        correctAnswer: answers[answerIdToIndex[correctAnswerId]!]!,
        type: types[typesIdToIndex[typeId]!]!,
        categories: [],
      });
    },
  );

  answers.forEach((answer, i) => {
    const { questionId } = parsedAnswers[i]!;
    // eslint-disable-next-line no-param-reassign
    answer.question = questions[questionIdToIndex[questionId]!]!;
  });

  const driversLicenseCategories = driversLicenseCategoriesFactory.getAll();
  parsedQuestionCategoriesDriversLicenseCategory.forEach(
    ({ questionId, driversLicenseCategoryId }) => {
      const question = questions[questionIdToIndex[questionId]!]!;
      const driversLicenseCategory =
        driversLicenseCategories[driversLicenseCategoryId - 1]!;

      question.categories.push(driversLicenseCategory);
    },
  );
};
